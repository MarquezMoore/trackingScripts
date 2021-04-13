<script>
  var videos = document.getElementsByTagName('video');
var allVideos = {};

for (var i = 0; i < videos.length; i++){
// Retrive id of current video
    var currentVid = videos[i]; // use to access properties of the HTML video object 

    var videoID = currentVid.getAttribute('id'); // use to access property of the allVideos object
    
        
// Declare propeties for currentVideo object
    // Add object to allVideos object with property name of currentVideo id with a value of empty object
    allVideos[videoID] = {};
    // Add properties to the nested videoID object
    allVideos[videoID].highestPercentage = 0; // will store the highest percentage watched in session
    allVideos[videoID].videoSource = currentVid.currentSrc;

// Add Event Listeners
    videos[i].addEventListener('play', eventHandler);
    videos[i].addEventListener('ended', eventHandler);
    videos[i].addEventListener('timeupdate', eventHandler);
};

function eventHandler(e){
    // e = current event object 
    switch(e.type){
        case 'timeupdate':
            // grab the current time at each 
            allVideos[e.target.id].currentTime = e.target.currentTime;
            allVideos[e.target.id].videoDuration = e.target.duration;
            
            // calculate the precentage of the video watched until now
            var percentage = Math.round((100 * (allVideos[e.target.id].currentTime / allVideos[e.target.id].videoDuration)));
            
            if((percentage % 25 === 0 && percentage > 0)){
                // set percentageWatched property for the respective video
                allVideos[e.target.id].percentageWatched = percentage;
                
                // Checked to ensure that highest percentage is updated if not already
                if(allVideos[e.target.id].percentageWatched > allVideos[e.target.id].highestPercentage && percentage !== 100){
                    allVideos[e.target.id].highestPercentage = percentage;
                    
                    // push to gtm dataLayer
                    dataLayer.push({ 
                        'event': 'MP4 Video',
                        'gaEventCategory': 'HTML 5 Video',
                        'gaEventAction': percentage +'%',
                        'gaEventLabel': getTitle(e.target.currentSrc),
                    })
                }
            } 
            break;
        case 'play':
            if(e.target.currentTime === 0){
                
            // push to gtm dataLayer
                dataLayer.push({ 
                    'event': 'MP4 Video',
                    'gaEventCategory': 'HTML 5 Video',
                    'gaEventAction':'Started',
                    'gaEventLabel': getTitle(e.target.currentSrc),
                })
            }
            break;
        case 'ended':
           
        // push to gtm dataLayer
            dataLayer.push({ 
                'event': 'MP4 Video',
                'gaEventCategory': 'HTML 5 Video',
                'gaEventAction':'Completed',
                'gaEventLabel': getTitle(e.target.currentSrc),
            })
            break;
    }

    function getTitle(src){
  
        src = src.split('/');
        
        parse = src[src.length -1]
        parse = parse.split('.')[0];
        parse = parse.split('-');
        parse = parse.slice(0, parse.length-1);
        
        vTitle = [];
        
        parse.forEach(function(part){
          current = part.slice(0, 1).toUpperCase();
          current = current + part.slice(1);
          vTitle.push(current);
        })
        
        return vTitle.join(' ');
        
        }
} 
</script>