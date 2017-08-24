var states = ["Chhattisgarh","Mizoram","Rajasthan","Telangana"]
var statesTotalSchools = [30,30,101,30]

var district =["Dhamtari","Bilaspur","Aizawl","Baran","Jaipur","Jhalawar","Sirohi","Peddapally","Jagityal","Jangaon","Jayashankar","Karimnagar(new)","Mahabubabad","Medchal","Ranga Reddy(new)","Siddipet","Siricilla-Rajanna","Vikarabad","Warangal(R)","Warangal(U)"]

var final_state_level_data = [];


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
//  State Level Nesting happens here 
    nestedData.forEach(function(state_level){
        var data = {};
        var state_level_implemented_school=0;
        var state_level_not_implemented_school=0;
        var state_level_no_data_available_school=0;
        var district_name;
//        console.log(state_level);
        
//  District Level Nesting happens here 
        state_level.values.forEach(function(district_level){
            
            state_level_no_data_available_school = state_level_no_data_available_school + district_level.values.length
            
            console.log(district_level);
            
            district_name = district[district_level.key-1];
            
                district_level.values.forEach(function(implemented_school_count){
                
                    console.log(implemented_school_count.values[implemented_school_count.values.length - 1]);
                    
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
            console.log(state_level_implemented_school)
            
        });
        
        
        
        
        
//      final object that is to be sent to d3 visulisation code         
        Stdata = {state : states[state_level.key-1], noOfImplementedSchools:state_level_implemented_school, noOfNotImplementedSchools: state_level_not_implemented_school,noDataAvailabeSchools : statesTotalSchools[state_level.key-1]-state_level_no_data_available_school}
        console.log(Stdata);
        
    })
                
})


     