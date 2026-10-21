var e=e=>Math.max(0,Math.min(1,e)),t=(t,n,r)=>{let i=e((r-t)/(n-t));return i*i*(3-2*i)},n=`
  uniform float hover; uniform float time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    /* gentle cloth-like bend, stronger on hover */
    p.z += sin(uv.x * 3.1416) * (0.06 + 0.1 * hover) + sin(uv.y * 6.0 + time * 1.6) * 0.012 * hover;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`,r=`
  uniform sampler2D map; uniform sampler2D vmap;
  uniform float aspect; uniform float vaspect; uniform float plane;
  uniform float mixV; uniform float opacity; uniform float hover; uniform float time;
  uniform vec3 rimA; uniform vec3 rimB;
  varying vec2 vUv;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  vec2 cover(vec2 uv, float img) {
    vec2 s = img > plane ? vec2(plane / img, 1.0) : vec2(1.0, img / plane);
    return (uv - 0.5) * s + 0.5;
  }
  vec3 sampleAt(vec2 uv) {
    vec3 a = texture2D(map, cover(uv, aspect)).rgb;
    vec3 b = texture2D(vmap, cover(uv, vaspect)).rgb;
    return mix(a, b, mixV);
  }
  void main() {
    float solid = hover;                 /* 0 = drifting projection, 1 = locked in */
    vec2 uv = vUv;
    /* glitch: a few horizontal bands jump sideways now and then */
    float row = floor(uv.y * 38.0);
    float tick = floor(time * 9.0);
    float g = step(0.985 - 0.02 * (1.0 - solid), hash(row * 1.7 + tick));
    uv.x += g * (hash(row + tick) - 0.5) * 0.06 * (1.0 - solid * 0.8);
    /* soft ripple */
    vec2 d = uv - 0.5;
    uv += normalize(d + 1e-4) * sin(length(d) * 26.0 - time * 4.0) * 0.004 * solid;
    uv = (uv - 0.5) * (1.0 - 0.05 * solid) + 0.5;
    /* RGB split */
    float sh = mix(0.006, 0.0018, solid);
    vec3 c;
    c.r = sampleAt(uv + vec2(sh, 0.0)).r;
    c.g = sampleAt(uv).g;
    c.b = sampleAt(uv - vec2(sh, 0.0)).b;
    /* hologram light: luminance pushed into cyan/violet, less once locked in */
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    vec3 holo = mix(rimA * 0.55, rimB * 1.15, smoothstep(0.1, 0.9, lum + vUv.y * 0.25));
    c = mix(c, holo * (0.35 + lum), mix(0.62, 0.12, solid));
    /* scanlines + fine moving bar */
    float scan = 0.82 + 0.18 * sin(vUv.y * 420.0 + time * 6.0);
    float bar = smoothstep(0.0, 0.04, abs(fract(vUv.y - time * 0.12) - 0.5) - 0.44);
    c *= mix(scan, 1.0, solid * 0.6);
    c += rimB * (1.0 - bar) * 0.12;
    /* grain */
    c += (hash(dot(vUv, vec2(127.1, 311.7)) + time) - 0.5) * 0.05;
    /* flicker */
    float flick = 0.94 + 0.06 * sin(time * 23.0 + hash(tick) * 6.0);
    /* feathered edges, no stroke: the image just fades into the space */
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = smoothstep(0.0, 0.07, e.x * plane) * smoothstep(0.0, 0.07, e.y);
    float alpha = edge * mix(0.78, 1.0, solid) * mix(flick, 1.0, solid);
    gl_FragColor = vec4(c, alpha * opacity);
  }`,i=(e,t,n)=>{let r=document.createElement(`canvas`);r.width=r.height=t;let i=r.getContext(`2d`),a=i.createRadialGradient(t/2,t/2,0,t/2,t/2,t/2);return n.forEach(([e,t])=>a.addColorStop(e,t)),i.fillStyle=a,i.fillRect(0,0,t,t),new e.CanvasTexture(r)},a=[[-.9,.25,.1],[1,-.2,-.12],[-.6,-.35,.08],[.9,.35,-.1],[-1,-.1,.12],[.7,.2,-.08],[-.8,.35,.1],[1,-.3,-.12]];function o(o,{tunnel:s,stage:c,canvas:l,projects:u,onFocus:d,onHover:f,onOpen:p,onHud:m}){let h=u.length,g=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,_=window.matchMedia(`(hover: none)`).matches,v=new o.WebGLRenderer({canvas:l,antialias:!0,alpha:!0});v.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),`outputColorSpace`in v&&(v.outputColorSpace=o.LinearSRGBColorSpace);let y=new o.Scene;y.fog=new o.Fog(199714,8,34);let b=new o.PerspectiveCamera(50,1,.05,120),x=1,S=1,C=!1,w=50,T=()=>{x=c.clientWidth,S=c.clientHeight,C=x<700,v.setSize(x,S,!1),b.aspect=x/S,w=C?64:50,b.fov=w,b.updateProjectionMatrix()};T(),window.addEventListener(`resize`,T);let E=6.2,D=3.95,O=D/E,k=2.2,ee=e=>{let n=Math.min(e*h,h-1e-6),r=Math.floor(n),i=n-r,a=r===0?-1.1:r-1;return a+(r-a)*t(0,.6,i)},A=e=>-e*E,j=e=>D-e*E,M=e=>{let[t,n,r]=a[e%a.length];return C?[t*.25,n*.4,r*.5]:[t,n,r]},te=e=>M(e)[0]<0?-1:1,N=e=>{let[t,n]=M(e);return C?[t,n-.95]:[t-te(e)*1.3,n*.75]},ne=e=>{if(e<=0){let[n,r]=N(0),i=t(-1.1,0,e);return[n*i,r*i]}let n=Math.floor(e),r=e-n,[i,a]=M(n),o=N(n);if(r<O){let e=t(0,O,r);return[o[0]+(i-o[0])*e,o[1]+(a-o[1])*e]}let s=n+1<h?N(n+1):[i,a],c=t(O,1,r);return[i+(s[0]-i)*c,a+(s[1]-a)*c]},re=new o.TextureLoader,P=u.map((e,t)=>{let i={map:{value:null},vmap:{value:null},aspect:{value:1.6},vaspect:{value:16/9},plane:{value:1.6},mixV:{value:0},opacity:{value:0},hover:{value:0},time:{value:0},rimA:{value:new o.Color(4653235)},rimB:{value:new o.Color(51455)}},a=new o.Mesh(new o.PlaneGeometry(k*1.6,k,32,20),new o.ShaderMaterial({uniforms:i,vertexShader:n,fragmentShader:r,transparent:!0,side:o.DoubleSide,depthWrite:!1}));a.userData.i=t,y.add(a),re.load(e.poster,e=>{`colorSpace`in e&&(e.colorSpace=o.LinearSRGBColorSpace),i.map.value=e;let t=e.image.width/e.image.height;i.aspect.value=t;let n=Math.max(.78,Math.min(1.78,t));i.plane.value=n,a.geometry.dispose(),a.geometry=new o.PlaneGeometry(k*n,k,32,20),i.vmap.value||(i.vmap.value=e)});let s={p:e,i:t,mesh:a,uniforms:i,hover:0,hot:!1,focused:!1,video:null};return s.ensureVideo=()=>{if(!e.clip||s.video)return;let t=document.createElement(`video`);Object.assign(t,{src:e.clip,muted:!0,loop:!0,playsInline:!0,preload:`auto`});let n=new o.VideoTexture(t);`colorSpace`in n&&(n.colorSpace=o.LinearSRGBColorSpace),t.addEventListener(`loadeddata`,()=>{i.vmap.value=n,i.vaspect.value=t.videoWidth/t.videoHeight}),s.video=t},s}),F=_?900:1800,I=new Float32Array(F*3),L=new Float32Array(F*3),ie=new o.Color(180/255,140/255,1),ae=new o.Color(0,200/255,1);for(let e=0;e<F;e++){I[e*3]=(Math.random()*2-1)*12,I[e*3+1]=(Math.random()*2-1)*7.5,I[e*3+2]=j(-1.1)+6-Math.random()*64;let t=Math.random()<.28?ae:ie;L[e*3]=t.r,L[e*3+1]=t.g,L[e*3+2]=t.b}let oe=i(o,64,[[0,`rgba(255,255,255,1)`],[.3,`rgba(255,255,255,0.8)`],[1,`rgba(255,255,255,0)`]]),R=new o.BufferGeometry;R.setAttribute(`position`,new o.BufferAttribute(I,3)),R.setAttribute(`color`,new o.BufferAttribute(L,3));let z=new o.Points(R,new o.PointsMaterial({size:.085,map:oe,vertexColors:!0,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,sizeAttenuation:!0,opacity:.9}));y.add(z);let B=new Float32Array(F*6),V=new Float32Array(F*6);for(let e=0;e<F;e++)for(let t=0;t<2;t++)V[e*6+t*3]=L[e*3],V[e*6+t*3+1]=L[e*3+1],V[e*6+t*3+2]=L[e*3+2];let H=new o.BufferGeometry;H.setAttribute(`position`,new o.BufferAttribute(B,3)),H.setAttribute(`color`,new o.BufferAttribute(V,3));let U=new o.LineSegments(H,new o.LineBasicMaterial({vertexColors:!0,transparent:!0,opacity:0,blending:o.AdditiveBlending,depthWrite:!1}));y.add(U);let W=new Float32Array(260*6),G=new o.BufferGeometry;G.setAttribute(`position`,new o.BufferAttribute(W,3));let se=new o.LineSegments(G,new o.LineBasicMaterial({color:9869020,transparent:!0,opacity:.16,blending:o.AdditiveBlending,depthWrite:!1}));y.add(se);let K={x:0,y:0,tx:0,ty:0,sx:-1,sy:-1},q=e=>{let t=c.getBoundingClientRect();K.sx=e.clientX-t.left,K.sy=e.clientY-t.top,K.tx=K.sx/x*2-1,K.ty=K.sy/S*2-1},J=()=>{K.tx=0,K.ty=0,K.sx=-1,K.sy=-1};c.addEventListener(`pointermove`,q),c.addEventListener(`pointerleave`,J);let ce=new o.Raycaster,le=new o.Vector2,ue=()=>{if(K.sx<0)return-1;le.set(K.sx/x*2-1,-(K.sy/S)*2+1),ce.setFromCamera(le,b);let e=ce.intersectObjects(P.filter(e=>e.uniforms.opacity.value>.6).map(e=>e.mesh));return e.length?e[0].object.userData.i:-1},de=(e,t)=>{let n=P[e];n&&(n.hot=t,t?(n.ensureVideo(),n.video?.play().catch(()=>{})):n.focused||n.video?.pause())},fe=()=>{let e=ue();e>=0&&p(e)};l.addEventListener(`click`,fe);let pe=()=>{let t=s.getBoundingClientRect(),n=window.innerHeight*.6;return e((n-t.top)/(t.height-window.innerHeight+n))},Y=-1.1,me=j(Y),X=0,Z=-1,he=-2,ge=!0,_e=0,Q=new IntersectionObserver(([e])=>{ge=e.isIntersecting});Q.observe(c);let ve=new o.Clock,ye=()=>{if(_e=requestAnimationFrame(ye),!ge)return;let e=ve.getElapsedTime(),n=pe();Y+=(ee(n)-Y)*(g?1:.08);let r=j(Y);X+=(me-r-X)*.2,me=r,K.x+=(K.tx-K.x)*.05,K.y+=(K.ty-K.y)*.05;let[i,a]=ne(Y);b.position.set(i+K.x*.35,a-K.y*.22,r),b.lookAt(i+K.x*.12,a-K.y*.08,r-10);let o=0;P.forEach((e,t)=>{let n=r-A(t);o=Math.max(o,Math.exp(-(n*n)/.5)),e._dz=n}),b.fov=w+o*14,b.updateProjectionMatrix();let s=-1,c=9;P.forEach((n,r)=>{let[i,a,o]=M(r),l=A(r),u=r-Y,d=r===0?1:t(.4829032258064516,1-O-.15,u),f=d*t(.05,1.2,n._dz);n.mesh.visible=f>.002,n.uniforms.opacity.value=f,n.uniforms.time.value=e;let p=1-t(.04,.26,Math.abs(u));p>.55&&!n.focused&&(n.focused=!0,n.ensureVideo(),n.video?.play().catch(()=>{})),p<.4&&n.focused&&(n.focused=!1,n.hot||n.video?.pause()),n.hover+=(Math.max(+!!n.hot,p)-n.hover)*.08,n.uniforms.hover.value=n.hover;let m=(n.hot||n.focused)&&n.video&&n.video.readyState>=2?1:0;n.uniforms.mixV.value+=(m-n.uniforms.mixV.value)*.1;let h=Math.sin(e*.5+r*1.7)*.05,g=(1-d)*-4;n.mesh.position.set(i,a+h,l+g);let _=Math.max(n.hover,t(2.2,.6,n._dz));n.mesh.rotation.y=o*(1-_)+K.x*.04,n.mesh.rotation.x=-K.y*.04+Math.sin(e*.4+r)*.012*(1-_),n.mesh.scale.setScalar((.7+.3*d)*(1+n.hover*.04+p*.12)),Math.abs(u)<c&&(c=Math.abs(u),s=r)});let l=c<.2?s:-1;if(l!==he&&(he=l,d(l,l>=0?te(l)<0?`left`:`right`:null)),!_){let e=ue();e!==Z&&(Z>=0&&de(Z,!1),e>=0&&de(e,!0),Z=e,f(e))}let u=g?0:.012,p=Math.min(3,Math.abs(X)*2.2+o*1.5),x=0;for(let e=0;e<F;e++){let t=I[e*3+2]+u;t>r+2&&(t-=64,I[e*3]=i+(Math.random()*2-1)*12,I[e*3+1]=a+(Math.random()*2-1)*7.5),t<r-64+2&&(t+=64),I[e*3+2]=t;let n=I[e*3],o=I[e*3+1];B[e*6]=n,B[e*6+1]=o,B[e*6+2]=t,B[e*6+3]=n,B[e*6+4]=o,B[e*6+5]=t-p}for(let e=0;e<F&&x<260;e+=3){let t=I[e*3+2];if(!(t>r-1.5||t<r-9))for(let n=e+3;n<F&&x<260;n+=3){let r=I[e*3]-I[n*3],i=I[e*3+1]-I[n*3+1],a=t-I[n*3+2];r*r+i*i+a*a<1.1&&(W.set([I[e*3],I[e*3+1],t,I[n*3],I[n*3+1],I[n*3+2]],x*6),x++)}}G.setDrawRange(0,x*2),G.attributes.position.needsUpdate=!0,R.attributes.position.needsUpdate=!0,H.attributes.position.needsUpdate=!0,U.material.opacity=Math.min(.8,p*.6),z.material.opacity=.9+o*.1,v.render(y,b),m(Math.min(h,Math.max(1,Math.round(Y)+1)),n)};ye();let $=new o.Vector3;return{screenRect:e=>{let t=P[e];t.mesh.geometry.computeBoundingBox();let n=t.mesh.geometry.boundingBox,r=l.getBoundingClientRect(),i=1/0,a=1/0,o=-1/0,s=-1/0;for(let e of[n.min.x,n.max.x])for(let c of[n.min.y,n.max.y]){$.set(e,c,0).applyMatrix4(t.mesh.matrixWorld).project(b);let n=r.left+($.x*.5+.5)*x,l=r.top+(-$.y*.5+.5)*S;i=Math.min(i,n),o=Math.max(o,n),a=Math.min(a,l),s=Math.max(s,l)}return{x0:i,y0:a,x1:o,y1:s,time:t.video?.currentTime}},destroy:()=>{cancelAnimationFrame(_e),Q.disconnect(),window.removeEventListener(`resize`,T),c.removeEventListener(`pointermove`,q),c.removeEventListener(`pointerleave`,J),l.removeEventListener(`click`,fe),P.forEach(e=>{e.video?.pause(),e.uniforms.map.value?.dispose(),e.mesh.geometry.dispose(),e.mesh.material.dispose()}),R.dispose(),H.dispose(),G.dispose(),oe.dispose(),v.dispose()}}}export{o as createWorkScene};