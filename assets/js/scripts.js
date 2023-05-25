$(document).ready(function(){
    newPageTitle = 'Salman Razak :|: Being creative mean be different...';
    document.title = newPageTitle;
    $('aside').load('nav.html');
    $('header').load('header.html');
    $('footer').load('footer.html');

    // color of the day
    const daycolor = new Date();
    const day = daycolor.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if(day==0){
        document.body.style.setProperty('--bg-color', '#a70606e0');
    } else if(day==1){
        document.body.style.setProperty('--bg-color', '#c9ee9b');
    } else if(day==2){
        document.body.style.setProperty('--bg-color', '#ec5f5f');
    } else if(day==3){
        document.body.style.setProperty('--bg-color', '#fe2b01');
    } else if(day==4){
        document.body.style.setProperty('--bg-color', '#fb2470');
    } else if(day==5){
        document.body.style.setProperty('--bg-color', '#27ddb0');
    } else if(day==6){
        document.body.style.setProperty('--bg-color', '#08d7e6');
    }
});

function inspire(){
    
}

$(function(){
    function id(v){
        return document.getElementById(v);
    }
    function loadbar() {
        var ovrl = id("overlay"),
            prog = id("progress"),
            stat = id("progstat"),
            img = document.images,
            c = 0,
            tot = img.length;
        if(tot == 0) return doneLoading();
        function imgLoaded(){
            c += 1;
            var perc = ((100/tot*c) << 0) +"%";
            prog.style.width = perc;
            stat.innerHTML = "Loading "+ perc;
            if(c===tot) return doneLoading();
        }
        function doneLoading(){
            ovrl.style.opacity = 0;
            setTimeout(function(){
                ovrl.style.display = "none";
            }, 1200);
        }
        for(var i=0; i<tot; i++) {
            var tImg     = new Image();
            tImg.onload  = imgLoaded;
            tImg.onerror = imgLoaded;
            tImg.src     = img[i].src;
        }
    }
    document.addEventListener('DOMContentLoaded', loadbar, false);
}());

function work_init(){
    scene = new THREE.Scene();            
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.id = 'workPage';
    renderer.setSize(window.innerWidth, window.innerHeight);        
    work_wrapper.appendChild(renderer.domElement);

    //const geometry = new THREE.OctahedronGeometry(25, 2);
    const geometry = new THREE.TorusKnotGeometry(  15, 4.5, 400, 50 );
    const material = new THREE.MeshPhongMaterial( {
        color: 0x60ed99, // 0xfe2b01
        side: THREE.DoubleSide,
    } );
    octahe = new THREE.Mesh( geometry, material );
    octahe.position.x = 15;
    scene.add( octahe );

    line = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({
            color: 0x999999,
            linewidth: 1,
            opacity: 0.2,
            transparent: true
        })
    );
    line.position.x = 15;
    scene.add(line);

    //controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.enableZoom = false;
    //controls.update();

    animate();

    window.addEventListener( 'resize', onWindowResize );
    
}

$(function(){
    $(document).on('click', '.menu', function(e){
        e.preventDefault();
        $('aside').toggleClass('full');
        $('header, footer').toggleClass('inside');
        $(this).text($(this).text() == 'Close' ? 'Menu' : 'Close');
    });
    $('.grid.three .item').on('click', function(){
        var fileUrl = $(this).data('file');
        window.location.replace(fileUrl);
    });
});

// mouse wheel scroll $(document).on('mousewheel', function(event){ console.log(event); });

function load_work_categories(){
    $.getJSON( "./assets/json/projects.json", function(data) {
        $.each(data, function(value){            
            var link = value.replace("/", "-");
            link = link.replace(" ","-");  
            $('section#work .work-nav').append('<li><a href="'+link+'.html">'+value+'</a><span>'+this.length+'</span></li>');
        });
    });
}

function load_uiux(){
    $.getJSON( "./assets/json/projects.json", function(data) {
        $.each(data['ui/ux designing'], function (index, value) {            
            $('section.work-category .grid.uiux').append('<div class="item '+value.path+'"><h2>'+value.name+'</h2><div class="screen '+value.device+'"><div class="swiper mySwiper"><div class="swiper-wrapper"></div></div></div>');
            console.log(value.name);
            for( let x=0; x < value.images.length; x++ ){
                $('section.work-category .grid.uiux .item.'+value.path+' .screen.'+value.device+' .swiper .swiper-wrapper').append('<div class="swiper-slide"><img src="./assets/media/uiux/'+value.path+'/'+value.images[x]+'" alt=""></div>');
            }
        });
    }).done(function(){        
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 0,
            autoHeight: true,
            pagination: {
                el: ".swiper-pagination",
                //clickable: true,
            }
        });        
    }).fail(function() {
        console.log( "error" );
    }).always(function() {
        console.log( "complete" );
    });
}

function load_logos(){
    $.getJSON( "./assets/json/projects.json", function(data) {
        $.each(data['logo designing'], function (index, value) {
            $('section.work-category .grid.logo').append('<div class="item"><img src="./assets/media/logos/logo-'+value.images+'" alt="'+value.name+'"><span>'+value.name+'</span></div>');
        });
    });
}

function load_threejs(){
    $.getJSON( "./assets/json/projects.json", function(data) {
        $.each(data['three js'], function (index, value) {            
            $('section.work-category .grid.three').append('<a class="item" href="'+value.link+'.html"><img src="./assets/media/threejs/'+value.images+'" alt=""><span>'+value.name+'</span></a>');
        });
    });
}

function load_branding(){
    $.getJSON( "./assets/json/projects.json", function(data) {
        $.each(data['branding'], function (index, value) {            
            $('section.work-category .grid.branding').append('<div class="item"><img src="./assets/media/branding/branding-'+value.images+'" alt=""><span>'+value.name+'</span></div>');
        });
    });
}

function load_digital(){
    $.getJSON( "./assets/json/projects.json", function(data) {
        $.each(data['digital media'], function (index, value) {            
            $('section.work-category .grid.digital').append('<div class="item '+value.path+'"><h2>'+value.name+'</h2><div class="screen '+value.device+'"><div class="swiper mySwiper"><div class="swiper-wrapper"></div></div></div>');
            for( let x=0; x < value.images.length; x++ ){
                $('section.work-category .grid.digital .item.'+value.path+' .swiper .swiper-wrapper').append('<div class="swiper-slide"><img src="./assets/media/digital/'+value.path+'/'+value.images[x]+'" alt=""></div>');
            }
        });
    }).done(function(){        
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 10,
            pagination: {
                el: ".swiper-pagination",
                //clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
            },
        });
    }).fail(function() {
        console.log( "error" );
    }).always(function() {
        console.log( "complete" );
    });
}

function load_print(){
    
    $.getJSON( "./assets/json/projects.json", function(data) {
        $.each(data['print'], function (index, value) {

            var url = './assets/media/print/pdf/'+value.path+'/'+value.file;
            var pdfjsLib = window['pdfjs-dist/build/pdf'];
            
            pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/js/pdf.worker.js';

            if(value.type == "pdf"){

                $('section.work-category .grid.print').append('<div class="item '+value.type+' '+value.path+'"><h2>'+value.name+'<sup>'+value.type+'</sup></h2><div id="container_'+value.path+'" class="container"><canvas id="canvas_'+value.path+'"></canvas><div class="action"><div class="buttons"><button id="prev_'+value.path+'">Previous</button><button id="next_'+value.path+'">Next</button></div><div class="status">Page: <div id="page_num_'+value.path+'"></div> / <div id="page_count_'+value.path+'"></div></div></div></div></div>');

                var pdfDoc = null;
                var pageNum = 1;
                var pageRendering = false;
                var pageNumPending = null;
                var scale = 1;

                var canvas = document.getElementById('canvas_'+value.path);
                var containerId = document.getElementsByClassName('.'+value.type+'.'+value.path);
                console.log(canvas);
                var ctx = canvas.getContext('2d');
                
                function renderPage(num) {

                    pageRendering = true;
                    
                    pdfDoc.getPage(num).then( function( page ) {

                        var viewport = page.getViewport({scale: scale});
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        
                        console.log(canvas.width);
                        containerId.clientHeight = canvas.height;
                        containerId.clientWidth = canvas.width;
                
                        var renderContext = { canvasContext: ctx, viewport: viewport };
                        var renderTask = page.render(renderContext);
            
                        renderTask.promise.then(function() {
                            pageRendering = false;
                            if (pageNumPending !== null) {
                                renderPage(pageNumPending);
                                pageNumPending = null;
                            }
                        });

                    });
                    
                    $('#page_num_'+value.path).html(num);//document.getElementById('page_num').textContent = num;

                }
                
                function queueRenderPage(num) {
                    if (pageRendering) {
                        pageNumPending = num;
                    } else {
                        renderPage(num);
                    }
                }
            
                function onPrevPage() {
                    if (pageNum <= 1) {
                        return;
                    }
                    pageNum--;
                    queueRenderPage(pageNum);
                }

                document.getElementById('prev_'+value.path).addEventListener('click', onPrevPage);
            
                function onNextPage() {
                    if (pageNum >= pdfDoc.numPages) {
                        return;
                    }
                    pageNum++;
                    queueRenderPage(pageNum);
                }
                
                document.getElementById('next_'+value.path).addEventListener('click', onNextPage);
            
                pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
                    pdfDoc = pdfDoc_;
                    document.getElementById('page_count_'+value.path).textContent = pdfDoc.numPages;
                    renderPage(pageNum);
                });
















                /*
                $('section.work-category .grid.print').append('<div class="item '+value.type+' '+value.path+'"><h2>'+value.name+'<sup>'+value.type+'</sup></h2><div class="container"><div class="flipbook_'+index+'"></div></div></div>');
                for( let x=0;x < value.images.length; x++ ){
                    $('section.work-category .grid.print .item.'+value.path+' .container .flipbook_'+index).append('<div class="page"><div class="gradient"></div><img src="./assets/media/print/pdf/'+value.path+'/'+value.images[x]+'" alt=""></div>');
                }
                */
            } else if(value.type == "stationary"){
                $('section.work-category .grid.print').append('<div class="item '+value.type+'"><h2>'+value.name+'<sup>'+value.type+'</sup></h2></div>');
            } else if(value.type == "broucher"){
                $('section.work-category .grid.print').append('<div class="item '+value.type + ' ' + value.path+'"><h2>'+value.name+'<sup>'+value.type+'</sup></h2><div class="images"></div></div>');
                for( let x=0;x < value.images.length; x++ ){
                    $('section.work-category .grid.print .item.'+value.path+' .images').append('<img src="./assets/media/print/'+value.type+'/'+value.path+'/'+value.images[x]+'" alt=""></div>');
                }
            }
        });
    }).done(function(){
        console.log('hi');
    });
    
}