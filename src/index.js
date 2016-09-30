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
        let result
        let replaceFn = function(match, offset, string) {
            let before = string[offset - 1]

            // In front of "Catalog" (Directory) allow wrap
            if (string[offset - 2] + before === '目录') {
                return '\n'
            }

            // In front of "order" (Sequence) allow wrap
            if (before === '序') {
                return '\n'
            }

            // Front end breaks are allowed
            // Other, question marks, exclamation marks, double quotation marks, ellipses
            if (before === '。' || before === '？' || before === '！' || before === '”' || before === '…') {
                return '\n'
            }

            // Thanks in the front, allowing wrap
            if (string[offset - 2] + before === '致谢') {
                return '\n'
            }

            // Front is in English.?! And breaks are allowed
            if (before === '.' || before === '?' || before === '!') {
                return '\n'
            }

            // In subsequent 10-character, there may be a "chapter x", "x", then breaks are allowed
            let after = string.substring(offset + 1, offset + 11)
            if (after.indexOf('第') > -1 && (after.indexOf('章') > -1 || after.indexOf('节') > -1)) { /* Subsection, Chapter || Section */
                return '\n'
            }

            // In other circumstances, space replaces newline with a
            // Originally intended to replace the empty, but think is replaced with spaces
            // Avoid poetry in the times article, the statement all together
            return ' '
        }

        result = string.replace(/\r\n/g, replaceFn)

        result = result.replace(/\n/g, replaceFn)

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
