
(function(window, document){
  var t = {
    saveAllDate:[],
    currMonDate:[],
    getMonthDate:function(){
      var curDate = new Date();
      var curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1);
      curDate.setDate(0);
      return curDate.getDate();
    },
    //获取全部文章日期
    //已知有6页 每页25条数据
    getAllArt:function(time){
      var _this = this,
          days,
          htm;
      for(var i=1; i<=time; i++){
        this.xhrRequest(i, function(){
        });
      }
    },
    xhrRequest:function(count, callback){
       var _this = this;
       var xhr = new XMLHttpRequest();

       //true异步
       xhr.open('get','http://www.cnblogs.com/zqzjs/default.html?page=' + count, true);
       xhr.onreadystatechange = function(){
          if(xhr.readyState === 4 && xhr.status === 200){
            
            //创建一个dom 用来存储返回的html
            var div = document.createElement('div');
            div.style.display = 'none';
            div.id = 'tempDiv';
            document.body.insertBefore(div, document.body.children[0]);
            document.getElementById('tempDiv').innerHTML = xhr.responseText;
            var dates = document.querySelectorAll('#tempDiv #content .post .postfoot');

            //获取html中的日期
            _this.statiDates(dates);

            callback();
             //移除dom
            _this.removeDom();
            
          }
       }
       xhr.send(null);
    },
    //筛选出当月的
    statiDates:function(datas){
      for(var i=0,len = datas.length; i<len; i++){
        var str = datas[i].innerText.trim();
        var strSp = str.split(' ')[2];
        this.saveAllDate.push(strSp);

        //顺便筛选出当月的
        var M = parseInt(strSp.split('-')[1],10);
        var Y = parseInt(strSp.split('-')[0],10);
        if(M === (new Date()).getMonth()+1 && Y === (new Date()).getFullYear()){
          this.currMonDate.push(strSp);
        }
      }
    },
    //移除dom
    removeDom:function(){
      document.body.removeChild(document.body.children[0]);
    },
    //获取当月每天的文章数目
    getAritcleCount:function(day){
      
      var date = day < 10 ? '0' + day : day,
          count = 0;
      for(var i=0; i<this.currMonDate.length; i++){
        if(parseInt(this.currMonDate[i].split('-')[2],10) === day){
          count ++;
        }
      }

      return count;
    },
    //颜色纬度
    colorLat:function(lat){

      switch (true){
          case lat == 0:
            return '#eeeeee';
          case lat < 2:
            return '#d6e685';
            
          case lat < 3:
            return '#8cc665';
            
          case lat < 4:
            return '#44a340';
            
          case lat > 4:
            return  '#1e6823';
          default:
            return '#eeeeee';
        }
    },
    //创建6*6表格
    createTable:function(days){
      if(days){
        var Tb = '',
            cell = [];
        for(var i=0; i<days; i++){
           cell.push(this.setCellColor(i+1));
        }
        Tb += '<table style="width:180px;height:180px">';
          Tb += '<tr>';
            Tb += cell.slice(0,6).join('');
          Tb += '</tr>';
          Tb += '<tr>';
            Tb += cell.slice(6,12).join('');
          Tb += '</tr>';
          Tb += '<tr>';
            Tb += cell.slice(12,18).join('');
          Tb += '</tr>';
          Tb += '<tr>';
            Tb += cell.slice(18,24).join('');
          Tb += '</tr>';
          Tb += '<tr>';
            Tb += cell.slice(24,30).join('');
          Tb += '</tr>';
          Tb += '<tr>';
            Tb += cell.slice(30,36).join('');
          Tb += '</tr>';
        Tb += '</table>';

        return Tb;
      }
    },
    //每个小方格
    cell:function(color){
      return '<td style="background-color:'+ color +'"></td>';
    },
    //设置颜色 并 返回单个方块
    setCellColor:function(day){
      var nums = this.getAritcleCount(day),
          color = this.colorLat(nums),
          cell = this.cell(color);

      return cell;
    },
    init:function(){
      this.getAllArt(6);
      var _this = this;
      setTimeout(function(){
        console.log('data[] = '+ _this.currMonDate);
        days = _this.getMonthDate();
        htm = _this.createTable(days);

        //挂载至window
        window.blog_2338792975_table = htm

        console.log('table = ' + htm)
      },500)
      
    }
  }

  t.init();
  
})(window, document)



