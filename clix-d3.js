
d3.csv("./IMT/DATA/NEWIMTENGLISH25May2017_results-3.csv",function(d){
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

})