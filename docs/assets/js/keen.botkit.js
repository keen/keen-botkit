var client = new Keen({
  projectId: "572565e124819665aec6f066",
  readKey: "be87233bca5a488dd166f7efd3aa1cafc90cd227cf156b08792e359c94a83615419644fbedcc4225331528cf7e3b0fb63b23495f0d8e1206ee3f5724a85b1892222ae11fa6344691b2ae40c62b1d0b9c190f5318b87c0355d3953332391c1351"
});

var sentCollection = 'sent_collection';
var receivedCollection = 'received_collection';

Keen.ready(function(){
  var messagesPerHourQuery = new Keen.Query("count", {
    eventCollection: receivedCollection,
    interval: "hourly",
    timeframe: {
      start: "2016-12-25T00:00:00.000Z",
      end: "2017-01-05T23:59:59.000Z"
    }
  });

  client.draw(messagesPerHourQuery, document.getElementById("metric-01"), {
    chartType: "areachart",
    title: false,
    height: 300,
    width: "auto",
    chartOptions: {
      chartArea: {
        left: '10%',
        width: '90%',
        top: '10%',
        height: '80%'
      },
      bar: {
        groupWidth: "85%"
      },
      isStacked: true
    }
  });

  var hourlyMessagesChart = new Keen.Dataviz()
     .el(document.getElementById('metric-02'))
     .chartType('columnchart')
     .height(300)
     .chartOptions({
       chartArea: {
           left: '10%',
           width: '90%',
           top: '10%',
           height: '80%'
       },
       isStacked:true,
       legend: { position: 'none' }
     })
     .prepare(); // start spinner


   client.run(messagesPerHourQuery, function(err, res) {
       if (err) throw('Error!');

       // Normalize the dates
       var now = new Date();
       now.setMinutes(0);
       now.setSeconds(0);

       var nestedData = d3.nest()
       .key(function(d) {
           // Use the hour of day as the key
           return new Date(d.timeframe.start).getHours();
       })
       .rollup(function(leaves) {
           var total = d3.sum(leaves, function(d) { return d.value; });
           // Use the average number of messages at a given hour as the value
           return {
               denominator: leaves.length,
               total: total,
               avg: total / leaves.length
           };
       })
       .entries(res.result);

       // Format your data so it can be drawn as an areachart
       var result = nestedData.map(function(d){
           var start = new Date(now);
           start.setHours(d.key);

           var date = new Date(start.getTime() + (60 * 60 * 1000));
           date.setMinutes(0);
           date.setSeconds(0);

           return {
               value: d.value.avg,
               timeframe: {
                   start: start.toISOString(),
                   end: date.toISOString()
               }
           };
       });

       // Render visualization
       hourlyMessagesChart
         .parseRawData({ result: result })
         .render();
   });


   var popularTeamsQuery = new Keen.Query("count", {
     eventCollection: receivedCollection,
     group_by: 'team',
     timeframe: {
       start: "2016-12-25T00:00:00.000Z",
       end: "2017-01-05T23:59:59.000Z"
     }
   });

   client.draw(popularTeamsQuery, document.getElementById("metric-03"), {
     chartType: 'piechart',
     title: false,
     height: 350,
     width: "auto",
     chartOptions: {
       chartArea: {
         height: "75%",
         left: "10%",
         top: "5%",
         width: "60%"
       }
     }
   });
});
