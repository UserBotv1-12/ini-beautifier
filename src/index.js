var fsp = require('fs-promise')
var path = require('path')
var jschardet = require('jschardet')
var inputDir = '../input/'
var outputDir = '../output'
var encodingForResult = 'utf8'

var mod = {
    init() {
        this.handle()
    },
    handle() {
        inputDir = inputDir || '../input/'
        outputDir = outputDir || '../output'
        var realPath

        if (path.isAbsolute(inputDir)) {
            realPath = inputDir
        } else {
            realPath = path.normalize(__dirname + '/' + inputDir)
        }
        console.log(realPath)

        fsp.readdir(realPath).then((files) => {
            console.log(files)
            for (var file of files) {

                fsp.readFile(realPath + file).then(function(data) {
                    var charset = jschardet.detect(data)
                    console.log(charset)

                    mod.writeFile(file, data)
                        // console.log(data.isEncoding(charset.encoding.toLowerCase().replace(/\-/g, '')))
                }).catch(function(e) {
                    console.log(e)
                })
            }
        }).catch(function(e) {
            console.log(e)
        })
    },
    writeFile(filename, content) {
        console.log(filename)
        var realPath

        if (path.isAbsolute(outputDir)) {
            realPath = outputDir
        } else {
            realPath = path.normalize(__dirname + '/' + outputDir)
        }
        if (realPath.slice(-1) !== '/') {
            realPath += '/'
        }
        console.log(realPath)

        fsp.writeFile(realPath + filename, content, encodingForResult).then(function(data) {

        }).catch(function(e) {
            console.log(e)
        })
    }
}

// run 
mod.init()
