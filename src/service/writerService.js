/**
 * @author HB
 * @date 2019/3/3
 * @fileName writerService.js
 * @Description: 获取致谢作家信息
*/
/*引用工具类*/
var _mm = require("util/mm");

var _writerService = {
        // 根据年份获取作家信息
        getWriterByYears: function (year, resolve, reject) {
            _mm.request({
                url: _mm.getServerUrl("http://localhost:8080/writer/get_writer_by_years.do"),
                data: {
                    year:year
                },
                method: "POST",
                success: resolve,
                error: reject
            });
        },
        // 获取年份
        getYears: function (resolve, reject) {
            _mm.request({
                url: _mm.getServerUrl("http://localhost:8080/writer/get_years.do"),
                method: "GET",
                success: resolve,
                error: reject
            });
        }
};

module.exports = _writerService;