var Mock4Tpl = require('../src/mock4tpl'),
    Print = require('node-print'),
    Handlebars = require('handlebars');

function heredoc(f) {
    return f.toString()
        .replace(/^[^\/]+\/\*!?/, '')
        .replace(/\*\/[^\/]+$/, '')
        .trim();
}

function run(tpl, options) {
    // console.log()
    // console.log(tpl);
    // console.log(options);

    var ast = Handlebars.parse(tpl);
    // console.log(ast);
    // console.log(JSON.stringify(ast, null, 4));

    var data = Mock4Tpl.gen(ast, null, options)
    // console.log(JSON.stringify(data, null, 4));
    return data
}

exports.testMustache = function(test) {
    var tpl = heredoc(function() {
        /*
{{title}}
{{title.s}}
    */
    })
    run(tpl, {
        s: '@EMAIL'
    })
    test.ok(true)
    test.done();
}

exports.testBlock = function(test) {
    var tpl = heredoc(function() {
        /*
{{#exist}}
    {{title}}
{{/exist}}
    */
    })
    run(tpl, {
        'exist|0-1': true
    })

    test.ok(true)
    test.done();
}

exports.testEach = function(test) {
    var tpl = heredoc(function() {
        /*
{{#each articles.[10].[#comments]}}
    <h1>{{subject}}</h1>
    <div>
        {{body}}
    </div>
{{/each}}
    */
    })
    run(tpl)

    test.ok(true)
    test.done();
}

exports.testComplex = function(test) {
    var tpl = heredoc(function() {
        /*
{{#exist}}
<div class="entry">
    <h1>{{title}}</h1>
    <div class="body">
        {{body}}
    </div>
    
    {{#bar}}
        {{foobar}}
    {{/bar}}

    {{#each articles.[10].[#comments]}}
    <h1>{{subject}}</h1>
    <div>
        {{body}}
    </div>
    {{/each}}

</div>
{{/exist}}
    */
    });
    run(tpl, {
        'exist|0-1': true,
        'foobar|1-100': 1,
        title: '@STRING(upper,10)',
        subject: '@BOOL',
        body: '@SENTENCE',
        // exist: true,
        articles: [],
        bar: []
    })

    test.ok(true)
    test.done();
}

var TC_CHANNEL = heredoc(function() {
    /*
<div class="dropdown" style="text-align:left; width:210px; height: 24px; line-height: 24px; float:right; margin-bottom:10px;">
  <span class="dropdown-hd" id="datepicker">
    选择日期
  </span>
</div>

<div bx-tmpl="list" bx-datakey="list">
  <table class="table" bx-name="tables" bx-path="brix/gallery/tables/" id="tables">
    <thead>
      <tr>
        <th width="15"></th>
        <th class="left">访问来源</th>
        <th class="left" width="200px">UV占比</th>
        <th class="left">UV</th>
        <th class="left">PV</th>
        <th class="left">人均页面访问数</th>
        <th class="left">宝贝收藏数</th>
        <th class="left">收藏率</th>
        <th class="left">成交金额</th>
        <th class="left">转化率</th>
        <th class="left">操作</th>
      </tr>
    </thead>
    <tbody>
      {{#list}}
      <tr class="tr-parent bold">
        <td class="left"><i mx-click="toggle" class="J_expendCollapse icon-expend"></i></td>
        <td class="left">{{分组}}</td>
        <td class="left font-tahoma">
          <span class="process-parent" style="width: {{UV占比}}px;"></span>
          {{UV占比}}%
        </td>
        <td class="left font-tahoma">{{UV}}</td>
        <td class="left font-tahoma">{{PV}}</td>
        <td class="left font-tahoma">{{人均页面访问数}}</td>
        <td class="left font-tahoma">{{宝贝收藏数}}</td>
        <td class="left font-tahoma">{{收藏率}}</td>
        <td class="left font-tahoma">{{成交金额}}</td>
        <td class="left font-tahoma">{{转化率}}</td>
        <td class="left">
        </td>
      </tr>
      {{#children}}
      <tr class="tr-child">
        <td class="left noline"></td>
        <td class="left">{{渠道}}</td>
        <td class="left font-tahoma">
          <span class="process-child" style="width: {{UV占比}}px;"></span>
          {{UV占比}}%
        </td>
        <td class="left font-tahoma">{{UV}}</td>
        <td class="left font-tahoma">{{PV}}</td>
        <td class="left font-tahoma">{{人均页面访问数}}</td>
        <td class="left font-tahoma">{{宝贝收藏数}}</td>
        <td class="left font-tahoma">{{收藏率}}</td>
        <td class="left font-tahoma">{{成交金额}}</td>
        <td class="left font-tahoma">{{转化率}}</td>
        <td class="left">
          <div class="operation">
            <a href="javascript:" mx-click="perspective{ srcIdLevel1:{{srcIdLevel1}},srcIdLevel2:{{srcIdLevel2}},channel:{{渠道}},vs:{{vs}} }" class="mr10">透视分析</a>
          </div>
        </td>
      </tr>
      {{/children}}
      {{/list}}

    </tbody>
  </table>
</div>
*/
})

exports.testScene = function(test) {
    var data = run(TC_CHANNEL, {
        'list|1-3': [],
        children: [],
        '分组|1': ['广告投放', '淘宝站内', '淘宝站外', '直接访问'],
        '渠道|1': ['钻石展位', '直通车', '淘宝联盟', '站内搜索', '淘金币', '聚划算', '百度搜索', '谷歌搜索', '新浪微博'],
        'percent|1-100': 1,
        'UV占比': '@percent%',
        'UV|1-100000000': 1,
        'PV|1-100000000': 1,
        '人均页面访问数|1-100000000': 1,
        '宝贝收藏数|1-100000000': 1,
        '收藏率': '@percent%',
        '成交金额|1-100000000.2': 1.0,
        '转化率': '@INTEGER(1,100)%',
        'srcIdLevel1|1-10': 1,
        'srcIdLevel2|1-10': 1,
        'vs': '@分组'
    })
    console.log();
    // console.log(data);
    var children = data.list[0].children
    for (var i = 0; i < data.list.length; i++) {
        delete data.list[i].children
    }
    Print.pt(data.list)
    Print.pt(children)

    test.ok(true)
    test.done();
}