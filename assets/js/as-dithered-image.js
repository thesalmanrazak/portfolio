const DITHERED_IMAGE_STYLE=`
.ditheredImageStyle {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    image-rendering: crisp-edges;
}
`
function createWorker(fn){var blob=new Blob(['self.onmessage = ',fn.toString()],{type:'text/javascript'});var url=URL.createObjectURL(blob);return new Worker(url);}
class ASDitheredImage extends HTMLElement{constructor(){super()
this.original_image_=undefined
this.force_refresh_=false
this.crunchFactor_=this.getAutoCrunchFactor()
this.canvas_=undefined
this.context_=undefined
this.image_loading_=false
this.ignore_next_resize_=false
this.worker_=createWorker(`onmessage=function(e){const result=dither(e.data.imageData,e.data.pixelSize,e.data.cutoff)
const reply={}
reply.imageData=result
reply.pixelSize=e.data.pixelSize
reply.cutoff=e.data.cutoff
postMessage(reply)}
function dither(imageData,scaleFactor,cutoff){let output=new ImageData(imageData.width*scaleFactor,imageData.height*scaleFactor)
for(let i=0;i<imageData.data.length;i+=4){imageData.data[i]=imageData.data[i+1]=imageData.data[i+2]=Math.floor(imageData.data[i]*0.3+imageData.data[i+1]*0.59+imageData.data[i+2]*0.11)}
let slidingErrorWindow=[new Float32Array(imageData.width),new Float32Array(imageData.width),new Float32Array(imageData.width)]
const offsets=[[1,0],[2,0],[-1,1],[0,1],[1,1],[0,2]]
for(let y=0,limY=imageData.height;y<limY;++y){for(let x=0,limX=imageData.width;x<limX;++x){let i=((y*limX)+x)*4;let accumulatedError=Math.floor(slidingErrorWindow[0][x])
let expectedMono=imageData.data[i]+accumulatedError
let monoValue=expectedMono
if(monoValue<=Math.floor(cutoff*255)){monoValue=0}else{monoValue=255}
let error=(expectedMono-monoValue)/8.0
for(let q=0;q<offsets.length;++q){let offsetX=offsets[q][0]+x
let offsetY=offsets[q][1]+y
if((offsetX>=0)&&(offsetX<slidingErrorWindow[0].length))
slidingErrorWindow[offsets[q][1]][offsetX]+=error}
for(let scaleY=0;scaleY<scaleFactor;++scaleY){let pixelOffset=(((y*scaleFactor+scaleY)*output.width)+(x*scaleFactor))*4
for(let scaleX=0;scaleX<scaleFactor;++scaleX){output.data[pixelOffset]=output.data[pixelOffset+1]=output.data[pixelOffset+2]=monoValue
output.data[pixelOffset+3]=255
pixelOffset+=4}}}
slidingErrorWindow.push(slidingErrorWindow.shift())
slidingErrorWindow[2].fill(0,0,slidingErrorWindow[2].length)}
return output}`);this.cutoff_=0.5
this.worker_.onmessage=((e)=>{const imageData=e.data.imageData
this.context_.putImageData(imageData,0,0)}).bind(this)
this.resizing_timeout_=undefined
this.last_draw_state_={width:0,height:0,crunchFactor:0,imageSrc:""}}
connectedCallback(){if(!this.isConnected){return}
const shadowDOM=this.attachShadow({mode:"open"})
const style=document.createElement("style")
style.innerHTML=DITHERED_IMAGE_STYLE
shadowDOM.appendChild(style)
this.canvas_=document.createElement("canvas")
this.canvas_.setAttribute("role","image")
this.canvas_.setAttribute("aria-label",this.getAttribute("alt"))
this.canvas_.classList.add("ditheredImageStyle")
shadowDOM.appendChild(this.canvas_)
this.context_=this.canvas_.getContext("2d",{willReadFrequently:true})
const resizeObserver=new ResizeObserver(((entries)=>{if(entries.length>0){if(entries[0].contentBoxSize){if(this.ignore_next_resize_==true){this.ignore_next_resize_=false
return}
if(this.resizing_timeout_!=undefined){clearTimeout(this.resizing_timeout_)}
this.resizing_timeout_=setTimeout((()=>{this.resizing_timeout_=undefined
this.force_refresh_=true
this.requestUpdate()}).bind(this),200)}}}).bind(this))
resizeObserver.observe(this.canvas_)
const intersectionObserver=new IntersectionObserver(((intersections)=>{if(intersections.length>0){if(intersections[0].isIntersecting){this.force_refresh_=true
this.requestUpdate()}}}).bind(this),{root:null,rootMargin:"1000px",threshold:[0]})
intersectionObserver.observe(this)
this.force_refresh_=true
this.requestUpdate()}
static get observedAttributes(){return["src","crunch","alt","cutoff"]}
attributeChangedCallback(name,oldValue,newValue){if(oldValue===newValue)return
if((name==="src")){this.force_refresh_=true
this.original_image_=undefined
this.requestUpdate()}else if(name==="crunch"){if(newValue==="auto"){this.crunchFactor_=this.getAutoCrunchFactor()}else if(newValue==="pixel"){this.crunchFactor_=1.0/this.getDevicePixelRatio()}else{this.crunchFactor_=parseInt(newValue,10)
if(isNaN(this.crunchFactor_)){this.crunchFactor_=this.getAutoCrunchFactor()}}
this.force_refresh_=true
this.requestUpdate()}else if(name==="alt"){this.altText=newValue;if(this.canvas!=undefined){let currentAltText=this.canvas.getAttribute("aria-label")
if(currentAltText!=newValue){this.canvas.setAttribute("aria-label",newValue)}}}else if(name==="cutoff"){this.cutoff_=parseFloat(newValue)
if(isNaN(this.cutoff_)){this.cutoff_=0.5}
this.cutoff_=Math.min(1.0,Math.max(0.0,this.cutoff_))
this.force_refresh_=true
this.requestUpdate()}}
getAutoCrunchFactor(){if(this.getDevicePixelRatio()<3){return 1}else{return 2}}
getDevicePixelRatio(){return window.devicePixelRatio}
isInOrNearViewport(){const margin=1500
const r=this.getBoundingClientRect()
const viewHeight=Math.max(document.documentElement.clientHeight,window.innerHeight)
const above=r.bottom+margin<0
const below=r.top-margin>viewHeight
return(!above&&!below)}
requestUpdate(){if(this.original_image_!=undefined){if(this.isInOrNearViewport()==false){return}}
window.requestAnimationFrame(((timestamp)=>{if((this.force_refresh_==false)){return}
if(this.original_image_==undefined){this.loadImage()
return}
if(this.force_refresh_){this.repaintImage()}}).bind(this))}
loadImage(){if(this.image_loading_==true){return}
this.image_loading_=true
const image=new Image()
image.src=this.getAttribute("src")
image.crossOrigin="Anonymous";image.decode().then((()=>{this.original_image_=image
this.ignore_next_resize_=true
this.canvas_.style.aspectRatio=this.original_image_.width+"/"+this.original_image_.height
this.force_refresh_=true
this.requestUpdate()}).bind(this)).catch(((decodeError)=>{console.log("Error decoding image: ",decodeError)
this.original_image_=undefined}).bind(this)).finally((()=>{this.image_loading_=false}).bind(this))}
repaintImage(){const rect=this.canvas_.getBoundingClientRect()
let screenPixelsToBackingStorePixels=this.getDevicePixelRatio()
let fractionalPart=screenPixelsToBackingStorePixels-Math.floor(screenPixelsToBackingStorePixels)
if((1.0/fractionalPart)>3){fractionalPart=0
screenPixelsToBackingStorePixels=Math.round(screenPixelsToBackingStorePixels)}
if(fractionalPart!=0){screenPixelsToBackingStorePixels=Math.round(screenPixelsToBackingStorePixels*Math.round(1.0/fractionalPart))}
const calculatedWidth=Math.round(rect.width*screenPixelsToBackingStorePixels)
const calculatedHeight=Math.round(rect.height*screenPixelsToBackingStorePixels)
let adjustedPixelSize=screenPixelsToBackingStorePixels*this.crunchFactor_
if((this.last_draw_state_.width==calculatedWidth)&&(this.last_draw_state_.height==calculatedHeight)&&(this.last_draw_state_.adjustedPixelSize==adjustedPixelSize)&&(this.last_draw_state_.imageSrc==this.original_image_.currentSrc)&&(this.last_draw_state_.cutoff==this.cutoff_)){return;}
this.canvas_.width=calculatedWidth
this.canvas_.height=calculatedHeight
this.last_draw_state_.width=this.canvas_.width
this.last_draw_state_.height=this.canvas_.height
this.last_draw_state_.adjustedPixelSize=adjustedPixelSize
this.last_draw_state_.imageSrc=this.original_image_.currentSrc
this.last_draw_state_.cutoff=this.cutoff_
this.context_.imageSmoothingEnabled=true
this.context_.drawImage(this.original_image_,0,0,this.canvas_.width/adjustedPixelSize,this.canvas_.height/adjustedPixelSize)
const originalData=this.context_.getImageData(0,0,this.canvas_.width/adjustedPixelSize,this.canvas_.height/adjustedPixelSize)
this.context_.fillStyle="white"
this.context_.fillRect(0,0,this.canvas_.width,this.canvas_.height)
const msg={}
msg.imageData=originalData
msg.pixelSize=adjustedPixelSize
msg.cutoff=this.cutoff_
this.worker_.postMessage(msg)
this.force_refresh_=false}}
window.customElements.define('as-dithered-image',ASDitheredImage);