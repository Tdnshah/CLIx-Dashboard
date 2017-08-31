// visulization code before importing csv
var svg = d3.select('body').append("svg").attr("width", 960).attr("height", 400).attr("align","center"),
    margin = {top: 50, right: 60, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right - 200,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("rect")
    .attr("width","100%")
    .attr("height","100%")
    .attr("fill","#eee9e9"),
    g = svg.append("text")
    .attr("x",960/2)
    .attr("y","30")
    .attr("text-anchor","middle")
    .text("CLIx Implementation Status [Last update: July 21st 2017]"),
    g = svg.append("g").append("text").attr("text-anchor","middle").attr("x",-200).attr("dy", "2em").attr("transform", "rotate(-90)").text("Percent of CLIx School");
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#A42491", "#000080", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

// visulization code before importing csv ended

// data manupulation global 
var states = ["Chhattisgarh","Mizoram","Rajasthan","Telangana"]
var statesTotalSchools = [30,30,101,30]
var columns1 = ["state","noDataAvailabeSchools","noOfImplementedSchools","noOfNotImplementedSchools"]

var district =["Dhamtari","Bilaspur","Aizawl","Baran","Jaipur","Jhalawar","Sirohi","Peddapally","Jagityal","Jangaon","Jayashankar","Karimnagar(new)","Mahabubabad","Medchal","Ranga Reddy(new)","Siddipet","Siricilla-Rajanna","Vikarabad","Warangal(R)","Warangal(U)"]

var final_state_level_data = [];
// data manupulation global ended

d3.csv("./IMT/DATA/NEWIMTENGLISH25May2017_results(4).csv",function(d){
    //here the first "d" contains an array, this array contains objects of rows of the csv file
    
    // hence we will nest this objects in the following fashion for us to get the data in proper heirarchy.
    
    // for nesting we will be using d3.nest() function availabel in d3.
    
    // First level of nesting will be done on the state_entry column to sort entries according to states
    var nestedData = d3.nest()
                    .key(function(d){return d.state_entry;})
                    .key(function(d){return d.district_entry;})
                    .key(function(d){return d.CLIx_code;})                
                    .key(function(d){return d.survey_time;})
                    .entries(d);
//  State Level Nesting happens here 
    nestedData.forEach(function(state_level){
        var data = {};
        var state_level_implemented_school=0;
        var state_level_not_implemented_school=0;
        var state_level_no_data_available_school=0;
        var district_name;
        console.log(state_level);
        
//  District Level Nesting happens here 
        state_level.values.forEach(function(district_level){
            
            state_level_no_data_available_school = state_level_no_data_available_school + district_level.values.length
            
//            console.log(district_level);
            
            district_name = district[district_level.key-1];
            
                district_level.values.forEach(function(implemented_school_count){
                
//                    console.log(implemented_school_count.values[implemented_school_count.values.length - 1]);
                    
                    if(implemented_school_count.values[implemented_school_count.values.length - 1].values[0]["CLIxModule_Impl"]== 1 ){
                        
                        state_level_implemented_school ++ ;
                        
                        }
                    else if (implemented_school_count.values[implemented_school_count.values.length - 1].values[0]["CLIxModule_Impl"]== 2){
                        state_level_not_implemented_school ++;
                        }
//                    implemented_school_count.values.forEach(function(implemented_school_count_final){
//                    
////                        console.log(implemented_school_count_final.values)
//                
//                    });
                });
        });
//      final object that is to be sent to d3 visulisation code         
        Stdata = {state : states[state_level.key-1], noOfImplementedSchools:state_level_implemented_school, noOfNotImplementedSchools: state_level_not_implemented_school,noDataAvailabeSchools : statesTotalSchools[state_level.key-1]-state_level_no_data_available_school}
        final_state_level_data.push(Stdata);
    })
        final_state_level_data.push({columns : columns1});
          
console.log(final_state_level_data[final_state_level_data.length-1]);  
  
    
    final_state_level_data.sort(function(a, b) { return b[final_state_level_data[final_state_level_data.length-1].columns[1]] / b.total - a[final_state_level_data[final_state_level_data.length-1].columns[1]] / a.total; });

  x.domain(final_state_level_data.map(function(d) { return d.state; }));
  z.domain(final_state_level_data[final_state_level_data.length-1].columns.slice(1));

  var serie = g.selectAll(".serie")
    .data(stack.keys(final_state_level_data[final_state_level_data.length-1].columns.slice(1))(final_state_level_data))
    .enter().append("g")
    .attr("class", "serie")
    .attr("fill", function(d) {return z(d.key);});
    
serie.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) {return x(d.data.state);})
    .attr("y", function(d) {return y(d[1]); })
    .attr("height", function(d) { console.log(x.bandwidth()) ;return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth())
    .on("mouseover", function(d){
				var xPos = parseFloat(d3.select(this).attr("x"));
				var yPos = parseFloat(d3.select(this).attr("y"));
				var height = parseFloat(d3.select(this).attr("height"));
				
				d3.select(this).attr("stroke","yellow").attr("stroke-width",5);						
            serie.append("rect")
                .attr("width",140)
                .attr("height",40)
                .attr("fill","#5089c8")
                .attr("opacity","0.8")
                .attr("x",xPos+90)
				.attr("y",y(d[1]))
				.attr("class","tool-tip-rect")
	        serie.append("text")
				.attr("x",xPos+95)
				.attr("y",y(d[1])+20)
				.attr("class","tooltip-dash")
				.attr("fill","white")
				.attr("opacity",1)
				.attr("text-anchor","right")
				.text(function(){
				     if(d[0]===0){
				    return "No of schools:- " + d.data.Implemented;
				    }else if (d[1] !== 1){
				    return "No.of schools:-" + d.data["Un-implemented"];
				    }
				    else{
				       return "No.of schools :-" + d.data["No Data Available"]
				    }
				})
				 
		})
		
		.on("mouseout",function(){
			serie.select(".tooltip-dash").remove();
			serie.select(".tool-tip-rect").remove();
			d3.select(this).attr("stroke","pink").attr("stroke-width",0);
														
		})
		.on("click",function(d){
		    console.log("doing");
		     if(d[0]===0){
				location.href = "http://clix.tiss.edu/dev/ver1.0/mizoram-school-data/"
			}else{
			console.log("Take me nowhere")
			}
		    
		});
// serie.selectAll('text')
//     .data(function(d) {return d;})
//     .enter()
//     .append("text")
//     .attr("x", function(d) {return x(d.data.State)+(x.bandwidth()/2);})
//     .attr("y", function(d) {return (y(d[1]));})
//     .attr("font-family", "sans-serif")
//     .attr("font-size", "15px")
//     .attr("fill", "black")
//     .attr("text-anchor","middle")
//     .text(function(d){return(d3.format(".0%")((d[1]-d[0])))});    

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height +")")
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10, "%"));

 var legend = g.selectAll(".legend")
    .data(final_state_level_data[final_state_level_data.length-1].columns.slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .style("font", "10px sans-serif");

  legend.append("rect")
      .attr("x", width + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });
    
    
    
})