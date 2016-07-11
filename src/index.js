var fsp = require('fs-promise')
var path = require('path')
var jschardet = require('jschardet')
var iconv = require('iconv-lite');

// 设置最终输出的文件的编码
var encodingForResult = 'utf8'

// 设置要处理的文件夹的路径
var inputDir = '../input/'

// 设置输出文件夹的路径
var outputDir = '../output'


var txtBeautifier = {
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
                    charset.encoding = charset.encoding.toLowerCase().replace(/\-/g, '')
                    console.log(charset)

                    var result = txtBeautifier.beautify(data, charset.encoding)

                    txtBeautifier.writeFile(file, result)

                }).catch(function(e) {
                    console.log(e)
                })
            }
        }).catch(function(e) {
            console.log(e)
        })
    },
    beautify(string, encoding) {
        var result

        string = iconv.decode(string, encoding)
        result = this.replace(string)

        return result
    },
    replace(string) {
        var result
            // result = string.replace(/\r\n/g, '')
        var replaceFn = function(match, offset, string) {
            var before = string[offset - 1]

            // 前面是“目录” 允许换行
            if (string[offset - 2] + before === '目录') {
                return '\n'
            }

            // 前面是“目录” 允许换行
            if (before === '序') {
                return '\n'
            }

            // 前面是句号，允许换行
            if (before === '。') {
                return '\n'
            }

            // 前面是致谢，允许换行
            if (string[offset - 2] + before === '致谢') {
                return '\n'
            }

            // 前面是英文 .?! ，允许换行
            if (before === '.' || before === '?' || before === '!') {
                return '\n'
            }

            // 后续的10个字符中，可能出现了“第x章”、“第x节”，那么允许换行
            var after = string.substring(offset + 1, offset + 11)
            if (after.indexOf('第') > -1 && (after.indexOf('章') > -1 || after.indexOf('节') > -1)) {
                return '\n'
            }

            // 其他情况 换行替换为空
            return ''
        }

        result = string.replace(/\r\n/g, replaceFn)

        result = result.replace(/\n/g, replaceFn)

        return result
    },
    writeFile(filename, content) {
        var realPath

        if (path.isAbsolute(outputDir)) {
            realPath = outputDir
        } else {
            realPath = path.normalize(__dirname + '/' + outputDir)
        }
        if (realPath.slice(-1) !== '/') {
            realPath += '/'
        }
        // console.log(realPath)

        fsp.mkdir(realPath).then(() => {
            fsp.writeFile(realPath + filename, content, encodingForResult).then((data) => {
                console.log('Complete, ', filename)
            }).catch(function(e) {
                console.log(e)
            })
        })
    }
}

// run 
txtBeautifier.init()
