$(document).ready(function(){
    $('aside').load('nav.html');
    $('header').load('header.html');
    $('footer').load('footer.html');
});

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

$(document).on('mousewheel', function(e){
    console.log(e);
});

$.ajax({
    url:"./assets/json/projects.json",
    dataType: 'json',
    async: false,
    type: 'GET',
    success:function(data){
        console.log(data);
        var sectionUl = $('ul.work-nav');
        $.each(data, function(i,v){
            //sectionUl.append('<li><a href="#">'+$(this).val()+'</a></li>');
        })
    }
});