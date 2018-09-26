var fsp = require('fs-promise')
var path = require('path')
var jschardet = require('jschardet')
var iconv = require('iconv-lite')

// Set the final output file encoding
var encodingForResult = 'utf8'

// Sets the path of the folder to process
var inputDir = '../input/'

// Set the path to the output folder
var outputDir = '../output'


var txtBeautifier = {
    init() {
        this.handle()
    },
    handle() {
        inputDir = inputDir || '../input/'
        outputDir = outputDir || '../output'
        let realPath
        let failedFiles = []

        if (path.isAbsolute(inputDir)) {
            realPath = path.join(inputDir, '/')
        } else {
            realPath = path.join(__dirname, inputDir, '/')
        }
        console.log('inputDir', realPath)

        fsp.readdir(realPath).then((files) => {
            console.log('all files:', files)

            for (let file of files) {
                new function(file, realPath) {
                    fsp.readFile(realPath + file).then((data) => {

                        let charset = jschardet.detect(data)
                            // Decode failed
                        if (!charset.encoding) {
                            failedFiles.push(file)
                            return
                        }

                        charset.encoding = charset.encoding.toLowerCase().replace(/\-/g, '')

                        let result = txtBeautifier.beautify(data, charset.encoding)

                        console.log('start write file:', file)
                        txtBeautifier.writeFile(file, result)

                    }).catch(function(e) {
                        console.log(e)
                    })
                }(file, realPath)
            }
        }).catch(function(e) {
            console.log(e)
        })
    },
    beautify(string, encoding) {
        let result

        string = iconv.decode(string, encoding)
        result = this.replace(string)

        return result
    },
    replace(string) {
        let result = string;

        // remove any whitespace from around '='
        result = result.replace(/(\s*=\s*)/g, '=');
        
        // uppercase key
        result = result.replace( /(\S+)=(\S+)/g, function($1,$2) {return $1.replace($1, $1.toUpperCase());}) 
                
        // remove blank lines
        result = result.replace( /^\s*(?:\r\n?|\n)/gm, "") 

        // lowecase the section
        result = result.replace( /^\[(\S+)\]/g, function(v) {return "\n" + v.toLowerCase(); }) 
        
        return result

    },
    writeFile(filename, content) {
        let realPath

        if (path.isAbsolute(outputDir)) {
            realPath = path.join(outputDir, '/')
        } else {
            realPath = path.join(__dirname, outputDir, '/')
        }
        console.log('outputDir:', realPath)

        let writeFile = function() {
            fsp.writeFile(realPath + filename, content, encodingForResult).then((data) => {
                console.log('Complete, ', filename)
            }).catch(function(e) {
                console.log(e)
            })
        }

        fsp.exists(realPath)
            .then((exists) => exists || fsp.mkdir(realPath))
            .then(writeFile)
            .catch(function(e) {
                console.log(e)
            })

    }
}

// run
txtBeautifier.init()
