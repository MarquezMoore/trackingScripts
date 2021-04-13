<script>

  (function(){
    var video = document.querySelector('.controlvideos');
    if(!video) return;
    var source = video.firstElementChild;
    allVideos = {};
   
    function readyVideo(mutations){

        mutations.forEach(function(mutation){
            var attribute = mutation.attributeName;
            
            if(attribute === 'src'){
                console.log(mutation);
                videoHandler(video);
            }
        })
    } 

    if(video){
      // Create new MutationObserver object
      var observer = new MutationObserver(readyVideo);

      //Define observer options object
      var options = {
        attributes: true
      }

      // Initialize the observation with target node and options objects
      observer.observe(source, options);
    }
    
// Function to Handler the HTML5 video event pushing    
    function videoHandler(video){
        
       
        // Retrive id of current video
            var currentVid = video; // use to access properties of the HTML video object 
            var videoID = currentVid.getAttribute('id'); // use to access property of the allVideos object
            
                
        // Declare propeties for currentVideo object
            // Add object to allVideos object with property name of currentVideo id with a value of empty object
            allVideos[videoID] = {};
            // Add properties to the nested videoID object
            allVideos[videoID].highestPercentage = 0; // will store the highest percentage watched in session
            
        // Add Event Listeners
            video.addEventListener('play', eventHandler);
            video.addEventListener('ended', eventHandler);
            video.addEventListener('timeupdate', eventHandler);
        
            
            function eventHandler(e){
                // e = current event object 
              
              // Get video Name
              var url = e.target.currentSrc;
              url = url.split('/');
              var vName = url[url.length - 1];
              vName = vName.split('.')[0];
            
                switch(e.type){
                    case 'timeupdate':
                        
                        // add and update objects
                        allVideos[e.target.id].currentTime = e.target.currentTime;
                        allVideos[videoID].videoSource = e.target.currentSrc;
                        allVideos[videoID].videoDuration = e.target.duration;
                        
                        // calculate the precentage of the video watched until now
                        var percentage = Math.round((100 * (allVideos[e.target.id].currentTime / allVideos[e.target.id].videoDuration)));
                       
                        if(((percentage % 25 === 0) && (percentage > 0))){
                            // set percentageWatched property for the respective video
                            allVideos[e.target.id].percentageWatched = percentage;
                            
                            // Checked to ensure that highest percentage is updated if not already
                            if((allVideos[e.target.id].percentageWatched > allVideos[e.target.id].highestPercentage) && (percentage !== 100)){
                                allVideos[e.target.id].highestPercentage = percentage;
                                
                                // Push to GTM
                                dataLayer.push({ 
                                    'event': 'MP4 Video',
                                    'gaEventCategory': 'HTML 5 Video',
                                    'gaEventAction': percentage +'%' + ' watched',
                                    'gaEventLabel': vName
                                })
                            }
                        } 
                        break;
                    case 'play':
                      if(!(e.target.currentTime > 0)){
                        // Push to GTM
                        dataLayer.push({ 
                            'event': 'MP4 Video',
                            'gaEventCategory': 'HTML 5 Video',
                            'gaEventAction':'Started',
                            'gaEventLabel': vName
                        })
                      }                  
                        break;
                    case 'ended':
                        // Push to GTM
                        dataLayer.push({ 
                            'event': 'MP4 Video',
                            'gaEventCategory': 'HTML 5 Video',
                            'gaEventAction':'Completed',
                            'gaEventLabel': vName
                        })
                        break;
                }
            }
    }
})();

</script>