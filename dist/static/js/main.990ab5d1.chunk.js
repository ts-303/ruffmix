(this["webpackJsonpmy-webpack-project"]=this["webpackJsonpmy-webpack-project"]||[]).push([[0],{129:function(e,t,n){},137:function(e,t,n){},144:function(e,t,n){},145:function(e,t,n){},146:function(e,t,n){"use strict";n.r(t);var i=n(3),a=n(6),r=n(7),c=n(8),s=n(1),o=n.n(s),l=n(25),d=n.n(l),j=(n(88),n(84)),u=(j.a.initializeApp({apiKey:"AIzaSyAhKNoLSbI082LfD08uTtt67fzuc3fDgzo",authDomain:"ruffmix-app.firebaseapp.com",projectId:"ruffmix-app",storageBucket:"ruffmix-app.appspot.com",messagingSenderId:"721486047256",appId:"1:721486047256:web:1487b9fc61c34d0a7efb6d"}),j.a,n(11)),h=(n(127),function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(a.a)(n,[{key:"componentDidMount",value:function(){var e=new u.bb,t=new u.T(50,window.innerWidth/window.innerHeight,.1,1500),n=new u.nb({alpha:!0});n.setClearColor("#e6eaff",1),n.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(n.domElement),window.addEventListener("resize",(function(){t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight)}),!1);var i,a=new u.J({color:65280});switch(Math.floor(3*Math.random())){case 0:i=new u.d;break;case 1:i=new u.j;break;case 2:i=new u.l;break;default:i=new u.d}var r=new u.I(i,a);t.position.z=3,e.add(r);!function i(){requestAnimationFrame(i),r.rotation.y+=.01,n.render(e,t)}()}},{key:"render",value:function(){return!0}}]),n}(o.a.Component)),p=(n(129),n(21)),b=n(197),x=n(179),f=n(175),O=n(177),m=n(184),v=n(185),y=n(75),g=n.n(y),S=n(74),C=n.n(S),w=n(201),k=n(182),P=n(203),D=n(198),T=n(204),I=n(183),R=n(199),A=n(205),z=n(186),N=n(200),M=n(5),E=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).newAccount=function(){a.props.router.updateContent(Object(M.jsx)(H,{router:a.props.router}))},a.startMatch=function(){a.props.router.updateContent(Object(M.jsx)(be,{router:a.props.router}))},a}return Object(a.a)(n,[{key:"render",value:function(){var e=this;return Object(M.jsx)(f.a,{in:!0,timeout:2e3,children:Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",justifyContent:"space-between",height:"100%",children:[Object(M.jsx)(O.a,{title:"Welcome"}),Object(M.jsxs)(b.a,{mx:"30%",display:"flex",flexDirection:"column",children:[Object(M.jsx)("body",{children:this.props.router.getUserState()}),Object(M.jsx)(x.a,{onClick:function(){return e.startMatch()},children:"Match Anonymously"}),Object(M.jsx)(x.a,{onClick:function(){return e.newAccount()},children:"Create New Account"})]}),Object(M.jsx)(b.a,{display:"flex",flexDirection:"row-reverse",children:Object(M.jsx)(x.a,{children:"How it works"})})]})})}}]),n}(o.a.Component),U=["Credentials","Personalization","Privacy Settings"],B=Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",children:[Object(M.jsx)(b.a,{p:2,children:Object(M.jsx)(w.a,{size:"small",id:"outlined-basic",label:"Email",variant:"outlined"})}),Object(M.jsx)(b.a,{p:2,children:Object(M.jsx)(w.a,{size:"small",id:"outlined-basic",label:"Password",variant:"outlined"})})]}),L=Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",children:[Object(M.jsx)(b.a,{p:2,children:Object(M.jsx)(w.a,{size:"small",id:"outlined-basic",label:"Genre",variant:"outlined"})}),Object(M.jsx)(b.a,{p:2,children:Object(M.jsx)(w.a,{size:"small",id:"outlined-basic",label:"Location",variant:"outlined"})}),Object(M.jsx)(b.a,{p:2,children:Object(M.jsxs)(k.a,{size:"large",children:[Object(M.jsx)(P.a,{id:"demo-simple-select-helper-label",children:"Role"}),Object(M.jsxs)(D.a,{labelId:"demo-simple-select-helper-label",id:"demo-simple-select-helper",children:[Object(M.jsx)(T.a,{value:10,children:"Ten"}),Object(M.jsx)(T.a,{value:20,children:"Twenty"}),Object(M.jsx)(T.a,{value:30,children:"Thirty"})]})]})})]});var H=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).resetInProp=function(e){e?a.setState({inProp:!1}):a.setState({inProp:!0})},a.returnButton=function(){a.props.router.previousHandler()},a.backButton=function(){var e=a.state.activeStep;e>0&&(a.setState({activeStep:e-1,inProp:!0}),a.resetInProp(!0))},a.nextButton=function(){var e=a.state.activeStep;e<U.length-1&&(a.setState({activeStep:e+1,inProp:!0}),a.resetInProp(!0))},a.setActiveStepContent=function(e){switch(e){case 0:a.setState({activeStepContent:B});break;case 1:a.setState({activeStepContent:L});break;case 2:a.setState({activeStepContent:(t=a.props.router,Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",children:[Object(M.jsx)(I.a,{control:Object(M.jsx)(R.a,{}),label:"Secondary"}),Object(M.jsx)(x.a,{onClick:function(){t.updateContent(Object(M.jsx)(E,{router:t})),t.updateUserState()},children:"Finish"})]}))});break;default:return}var t},a.state={content:"",activeStep:0,activeStepContent:B,inProp:!0},a}return Object(a.a)(n,[{key:"render",value:function(){var e=this;return Object(M.jsx)(f.a,{in:!0,children:Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",justifyContent:"space-between",height:"100%",textAlign:"center",children:[Object(M.jsx)(O.a,{title:"Create New Account"}),Object(M.jsxs)(b.a,{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",mx:10,children:[Object(M.jsx)(b.a,{children:Object(M.jsx)("div",{hidden:0==this.state.activeStep,children:Object(M.jsx)(m.a,{onClick:function(){return e.backButton()},children:Object(M.jsx)(C.a,{})})})}),Object(M.jsx)(b.a,{children:Object(M.jsx)(v.a,{in:this.state.inProp,onExited:function(){return e.resetInProp(!1)},onEntering:function(){return e.setActiveStepContent(e.state.activeStep)},direction:"up",children:this.state.activeStepContent})}),Object(M.jsx)(b.a,{children:Object(M.jsx)("div",{hidden:2==this.state.activeStep,children:Object(M.jsx)(m.a,{onClick:function(){return e.nextButton()},children:Object(M.jsx)(g.a,{})})})})]}),Object(M.jsx)(A.a,{activeStep:this.state.activeStep,alternativeLabel:!0,children:U.map((function(e){return Object(M.jsx)(z.a,{children:Object(M.jsx)(N.a,{orientation:"vertical",children:e})},e)}))})]})})}}]),n}(o.a.Component),W=n(23),$=n(95),F=n.n($),J=n(96),Y=n.n(J),q=n(97),G=n.n(q),K=n(98),V=n.n(K),_=(n(137),n(206)),Q=n(187),X=n(101),Z=n.n(X),ee=n(100),te=n.n(ee),ne=n(102),ie=n.n(ne),ae=n(99),re=n.n(ae),ce=(n(138),function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={comment:a.props.comment,user:a.props.user,playerObject:a.props.player},a}return Object(a.a)(n,[{key:"parsedComment",value:function(){var e=this,t=this.state.comment.split(new RegExp("(\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d\\s|\\d\\:\\d\\d\\-\\d\\:\\d\\d\\s)")),n=new RegExp("^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d\\s|^\\d\\:\\d\\d\\-\\d\\:\\d\\d\\s| \\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d|\\d\\:\\d\\d\\-\\d\\:\\d\\d |\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|\\d\\:\\d\\d\\-\\d\\:\\d\\d$|^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|^\\d\\:\\d\\d\\-\\d\\:\\d\\d$","g");return t.map((function(t){if(t)return t.match(n)?Object(M.jsx)("div",{children:Object(M.jsx)(_.a,{size:"small",label:t,clickable:!0,variant:"outlined",onClick:function(){e.state.playerObject.playFrom(t)},style:{backgroundColor:"hsla(200, 50%, 70%, 0.4)",borderColor:"hsla(200, 50%, 70%, 0.4)"}})}):Object(M.jsx)("div",{children:t})}))}},{key:"render",value:function(){return Object(M.jsxs)(b.a,{padding:"5px",margin:"2px",display:"flex",flexDirection:"column",justifyContent:"flex-start",flexWrap:"wrap",minWidth:"96px",style:{backgroundColor:"lightgrey"},borderRadius:4,children:[Object(M.jsx)("div",{className:"user",children:this.state.user}),Object(M.jsx)("div",{className:"comment",children:this.parsedComment()})]})}}]),n}(o.a.Component));function se(e){var t=Object(s.useRef)(),n=Object(s.useRef)(),i=e.isChild?64:96;return Object(s.useEffect)((function(){if(t.current){var a=F.a.create({container:t.current,height:i,progressColor:"lightgrey",waveColor:"lightgreen",responsive:"true",plugins:[Y.a.create({container:n.current,height:i,timeInterval:7.5}),V.a.create({showTime:"true",opacity:"1"}),G.a.create({regionsMinLength:2})]});a.enableDragSelection({color:"hsla(400, 100%, 30%, 0.1)",id:"dragSelection"}),a.on("ready",(function(){return e.handleReady(a)})),a.on("audioprocess",(function(){return e.setTime()})),a.on("seek",(function(){return e.setTime()})),a.load("https://upload.wikimedia.org/wikipedia/commons/f/f2/Median_test.ogg")}}),[]),Object(M.jsxs)("div",{children:[Object(M.jsx)(b.a,{position:"relative",zIndex:"5",ref:t}),Object(M.jsx)("div",{style:{opacity:"20%",marginTop:-i,pointerEvents:"none"},ref:n})]})}var oe=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).handleTextChange=function(e){a.setState({commentContent:e.target.value}),a.previewRegion(),a.checkRegions(),e.preventDefault()},a.handleTimeChange=function(e){a.setState({inputTime:e.target.value}),e.preventDefault()},a.handleTimeSubmit=function(e){var t=a.state.commentContent.concat(a.state.inputTime);a.setState({commentContent:t,inputTime:""}),e.preventDefault()},a.handleCommentSubmit=function(e){if(a.state.commentContent){a.addRegions();var t=a.state.commentArr.concat(Object(M.jsx)(ce,{user:"New User",comment:a.state.commentContent,player:Object(W.a)(a)}));a.setState({commentArr:t,commentContent:"",inputTime:""})}a.checkRegions(),e.preventDefault()},a.state={playState:!1,expand:!1,description:"",isChild:a.props.isChild,commentArr:[],commentContent:"",inputTime:"",playerObject:"",playerDuration:"",currentTime:"",controller:a.props.controller,containsPreviews:!1},a.handleReady=a.handleReady.bind(Object(W.a)(a)),a.setTime=a.setTime.bind(Object(W.a)(a)),a}return Object(a.a)(n,[{key:"clearPreviewRegions",value:function(){if(this.state.playerObject){var e=this.state.playerObject.regions.list;Object.keys(e).forEach((function(t){e[t].id.includes("preview")&&e[t].remove()}))}}},{key:"previewRegion",value:function(){var e=this;this.clearPreviewRegions();var t=new RegExp("^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d\\s|^\\d\\:\\d\\d\\-\\d\\:\\d\\d\\s| \\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d|\\d\\:\\d\\d\\-\\d\\:\\d\\d |\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|\\d\\:\\d\\d\\-\\d\\:\\d\\d$|^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|^\\d\\:\\d\\d\\-\\d\\:\\d\\d$","g"),n=this.state.commentContent.match(t);n&&n.forEach((function(t){var n=t.split("-",2),i=n[0],a=n[1],r=i.split(":"),c=60*r[0]+1*r[1],s=a.split(":"),o=60*s[0]+1*s[1],l=e.state.playerObject.getDuration();if(c>=0&&o>=0&&c<=l&&o<=l){var d=e.state.playerObject.regions.list;if(d){var j=0,u=!1;Object.keys(d).forEach((function(e){j++,d[e].start===c&&d[e].end===o&&d[e].id.includes("preview")&&(u=!0)})),u||e.state.playerObject.addRegion({id:"preview "+j,start:c,end:o,resize:!1,color:"hsla(400, 100%, 30%, 0.1)"})}}}))}},{key:"checkRegions",value:function(){var e=this.state.playerObject.regions.list,t=this.state.commentContent,n=!1;Object.keys(e).forEach((function(i){var a=e[i].start,r=e[i].end,c=new Date(1e3*a).toISOString().substr(15,4),s=new Date(1e3*r).toISOString().substr(15,4);e[i].id.includes("preview")&&(n=!0),e[i].id.includes("preview")&&!t.includes(c+"-"+s)&&e[i].remove()})),this.setState({containsPreviews:n})}},{key:"addRegions",value:function(){var e=this.state.playerObject.regions.list,t=this.state.playerObject;this.checkRegions(),e&&Object.keys(e).forEach((function(n){e[n].id.includes("preview")&&(t.addRegion({start:e[n].start,end:e[n].end,color:"hsla(200, 50%, 70%, 0.4)",resize:!1,drag:!1}),e[n].remove())}))}},{key:"getSeconds",value:function(e){var t=e.split(":"),n=t[0],i=t[1];return parseInt(60*n)+parseInt(i)}},{key:"setTime",value:function(){this.setState({currentTime:new Date(1e3*this.state.playerObject.getCurrentTime()).toISOString().substr(11,8)})}},{key:"handleReady",value:function(e){var t=this,n=new Date(1e3*e.getDuration()).toISOString().substr(11,8);this.setState({playerObject:e,playerDuration:n}),this.state.playerObject.on("region-update-end",(function(e){if("dragSelection"==e.id){var n=e.start,i=e.end,a=new Date(1e3*n).toISOString().substr(15,4),r=new Date(1e3*i).toISOString().substr(15,4),c=t.state.commentContent.concat(a+"-"+r+" ");t.setState({commentContent:c}),e.remove(),t.previewRegion(),t.checkRegions()}})),this.checkRegions(),this.state.playerObject.on("pause",(function(){0!=t.state.playState&&t.setState({playState:!t.state.playState})}))}},{key:"stopPlay",value:function(){this.setState({playState:!1}),this.state.playerObject.pause()}},{key:"playFrom",value:function(e){var t=e.split("-"),n=this.getSeconds(t[0]),i=this.getSeconds(t[1]);this.togglePlay(n,i)}},{key:"togglePlay",value:function(e,t){e?this.state.playerObject.play(e,t):this.state.playerObject.playPause(),this.setState({playState:!("seek"!=e&&!e)||!this.state.playState}),""==this.state.controller.getPrevPlayer()?this.state.controller.setPrevPlayer(this):this!=this.state.controller.getPrevPlayer()&&(this.state.controller.getPrevPlayer().stopPlay(),this.state.controller.setPrevPlayer(this))}},{key:"toggleExpand",value:function(){this.setState({expand:!this.state.expand})}},{key:"render",value:function(){var e=this;return Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",padding:"10px",children:[Object(M.jsx)(b.a,{style:{display:this.state.isChild?"flex":"none"},paddingLeft:"70%",margin:"10px",children:Object(M.jsx)(re.a,{style:{color:"lightgrey"},fontSize:"small"})}),Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"flex-start",paddingLeft:"20%",style:{display:this.state.isChild?"none":"true"},children:"Song Title"}),Object(M.jsxs)(b.a,{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"flex-end",children:[Object(M.jsx)(m.a,{onClick:function(){e.togglePlay()},size:"small",edge:"start",style:{marginRight:"5px"},children:this.state.playState?Object(M.jsx)(te.a,{style:{width:this.state.isChild?"48px":"64px",height:this.state.isChild?"48px":"64px"}}):Object(M.jsx)(Z.a,{style:{width:this.state.isChild?"48px":"64px",height:this.state.isChild?"48px":"64px"}})}),Object(M.jsx)(b.a,{width:this.state.isChild?"60%":"80%",children:Object(M.jsx)(se,{isChild:this.state.isChild,playState:this.state.playState,handleReady:this.handleReady,setTime:this.setTime})})]}),Object(M.jsxs)(b.a,{marginTop:"-3%",display:"flex",flexDirection:"row-reverse",style:{zIndex:"1"},children:[this.state.currentTime,"/",this.state.playerDuration]}),Object(M.jsxs)(b.a,{onClick:function(){e.toggleExpand()},display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"center",children:[Object(M.jsx)(_.a,{variant:"outlined",size:"small",label:"Comments"}),Object(M.jsx)(m.a,{onClick:function(){e.toggleExpand()},size:"small",children:Object(M.jsx)(ie.a,{style:{width:"24px",height:"24px"}})})]}),Object(M.jsxs)(Q.a,{onClick:function(){e.state.expand||e.toggleExpand()},in:!!this.state.expand,collapsedHeight:15,children:[Object(M.jsx)(b.a,{display:"flex",marginLeft:this.state.isChild?"40%":"20%",flexDirection:"column",alignItems:"flex-start",flexWrap:"wrap",children:this.state.commentArr}),Object(M.jsxs)(b.a,{display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"center",marginTop:"5px",children:[Object(M.jsxs)("form",{onSubmit:this.handleCommentSubmit,children:[Object(M.jsx)(w.a,{label:"New Comment",placeholder:". . .",multiline:!0,variant:"outlined",value:this.state.commentContent,onChange:this.handleTextChange,size:"small"}),Object(M.jsx)(x.a,{size:"small",type:"submit",children:"Submit"})]}),Object(M.jsxs)("form",{onSubmit:this.handleTimeSubmit,children:[Object(M.jsx)(w.a,{label:"Mins",placeholder:"...",multiline:!0,variant:"outlined",value:this.state.inputTime,onChange:this.handleTimeChange,size:"small"}),Object(M.jsx)(x.a,{size:"small",type:"submit",children:"Time"})]}),Object(M.jsx)(x.a,{size:"small",onClick:function(){return e.clearPreviewRegions()},style:{display:this.state.containsPreviews?"flex":"none"},children:"Clear Regions"})]})]})]})}}]),n}(o.a.Component),le=["Upload","Describe","Areas","Match","Review","Feedback"],de=Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",textAlign:"center",children:[Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"center",alignSelf:"center",children:Object(M.jsx)("h2",{children:"Upload Your Track"})}),Object(M.jsx)(b.a,{p:2,children:"upload area"}),Object(M.jsx)(b.a,{p:2,children:"upload area"})]}),je=Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",textAlign:"center",children:[Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"center",alignSelf:"center",children:Object(M.jsx)("h2",{children:"Describe Your Track"})}),Object(M.jsx)(b.a,{p:2,children:"upload area"}),Object(M.jsx)(b.a,{p:2,children:"upload area"})]}),ue=Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",textAlign:"center",children:[Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"center",alignSelf:"center",children:Object(M.jsx)("h2",{children:"What areas would you like feedback on?"})}),Object(M.jsx)(b.a,{p:2,children:"upload area"}),Object(M.jsx)(b.a,{p:2,children:"upload area"})]}),he=Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",textAlign:"center",children:[Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"center",alignSelf:"center",children:Object(M.jsx)("h2",{children:"Now Matching. . ."})}),Object(M.jsx)(b.a,{p:2,children:"upload area"})]}),pe=Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",textAlign:"center",children:[Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"center",alignSelf:"center",children:Object(M.jsx)("h2",{children:"Review Track"})}),Object(M.jsx)(b.a,{p:2,children:Object(M.jsx)(oe,{isChild:!1,controller:void 0})}),Object(M.jsx)(b.a,{p:2,children:"upload area"})]});var be=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).restartMatch=function(){a.setState({activeStep:0,inProp:!0}),a.resetInProp(!0)},a.resetInProp=function(e){e?a.setState({inProp:!1}):a.setState({inProp:!0})},a.returnButton=function(){a.props.router.previousHandler()},a.backButton=function(){var e=a.state.activeStep;e>0&&(a.setState({activeStep:e-1,inProp:!0}),a.resetInProp(!0))},a.nextButton=function(){var e=a.state.activeStep;e<le.length-1&&(a.setState({activeStep:e+1,inProp:!0}),a.resetInProp(!0))},a.setActiveStepContent=function(e){switch(e){case 0:a.setState({activeStepContent:de});break;case 1:a.setState({activeStepContent:je});break;case 2:a.setState({activeStepContent:ue});break;case 3:a.setState({activeStepContent:he});break;case 4:a.setState({activeStepContent:pe});break;case 5:a.setState({activeStepContent:(t=a.props.router,n=a.restartMatch,Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",textAlign:"center",children:[Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"center",alignSelf:"center",children:Object(M.jsx)("h2",{children:"Your Feedback"})}),Object(M.jsx)(b.a,{p:2,children:"(insults)"}),Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",children:[Object(M.jsx)(x.a,{onClick:n,children:"Match Again"}),Object(M.jsx)(x.a,{onClick:function(){return t.updateContent(Object(M.jsx)(H,{router:t}))},children:"Create New Account"})]})]}))});break;default:return}var t,n},a.state={content:"",activeStep:0,activeStepContent:de,inProp:!0,subHeader:""},a}return Object(a.a)(n,[{key:"render",value:function(){var e,t=this;return Object(M.jsx)(f.a,{in:!0,children:Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center",children:[Object(M.jsx)(b.a,{display:"flex",flexDirection:"row",justifyContent:"center",position:"absolute",top:"0",alignSelf:"center",children:Object(M.jsx)(O.a,{title:"Match"})}),Object(M.jsxs)(b.a,(e={display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between"},Object(p.a)(e,"alignItems","center"),Object(p.a)(e,"mx",10),Object(p.a)(e,"children",[Object(M.jsx)(b.a,{children:Object(M.jsx)(m.a,{disabled:0==this.state.activeStep,onClick:function(){return t.backButton()},children:Object(M.jsx)(C.a,{})})}),Object(M.jsx)(b.a,{children:Object(M.jsx)(v.a,{in:this.state.inProp,onExited:function(){return t.resetInProp(!1)},onEntering:function(){return t.setActiveStepContent(t.state.activeStep)},direction:"up",children:this.state.activeStepContent})}),Object(M.jsx)(b.a,{children:Object(M.jsx)(m.a,{disabled:5==this.state.activeStep,onClick:function(){return t.nextButton()},children:Object(M.jsx)(g.a,{})})})]),e))]})})}}]),n}(o.a.Component),xe=n(193),fe=n(104),Oe=n(194),me=n(103),ve=n.n(me),ye=n(207),ge=n(188),Se=n(189),Ce=n(190),we=n(191),ke=n(192);n(144);var Pe=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).setPrevPlayer=function(e){a.setState({prevPlayer:e})},a.state={userInfoSection:"",userTrackSection:"",prevPlayer:""},a.setPrevPlayer=a.setPrevPlayer.bind(Object(W.a)(a)),a}return Object(a.a)(n,[{key:"getPrevPlayer",value:function(){return this.state.prevPlayer}},{key:"componentDidMount",value:function(){this.setState({userInfoSection:(this.props.router,Object(M.jsxs)("div",{children:[Object(M.jsx)(v.a,{in:!0,direction:"right",children:Object(M.jsxs)(b.a,{display:"flex",flexDirection:"row",alignItems:"center",children:[Object(M.jsx)(ye.a,{style:{marginRight:"10px",width:"96px",height:"96px"},src:"https://cdn2.iconfinder.com/data/icons/music-studio-2/64/cd-recording-music-audio-studio-512.png"}),Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"flex-start",style:{height:"96px"},children:[Object(M.jsx)(b.a,{className:"userName",children:"UserNameText"}),Object(M.jsx)(b.a,{className:"userRole",children:"Producer"}),Object(M.jsx)(b.a,{className:"userRole",children:"Atlanta"})]})]})}),Object(M.jsx)(v.a,{in:!0,direction:"right",children:Object(M.jsxs)(b.a,{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",height:"100%",children:[Object(M.jsxs)(b.a,{display:"flex",marginTop:"10px",flexDirection:"row",children:[Object(M.jsx)(x.a,{children:"Message"}),Object(M.jsx)(x.a,{children:"Add To Contacts"})]}),Object(M.jsx)(ge.a,{children:Object(M.jsxs)(Se.a,{children:[Object(M.jsxs)(Ce.a,{children:[Object(M.jsx)(we.a,{align:"left",children:Object(M.jsx)("b",{children:"Genres"})}),Object(M.jsx)(we.a,{children:"Techno, Trance, House, Jungle, Hardbass"})]}),Object(M.jsxs)(Ce.a,{children:[Object(M.jsx)(we.a,{align:"left",children:Object(M.jsx)("b",{children:"Description"})}),Object(M.jsx)(we.a,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim"})]})]})})]})})]}))})}},{key:"render",value:function(){return Object(M.jsxs)("div",{className:"account-view",children:[Object(M.jsx)(b.a,{className:"user-info",style:{backgroundColor:""},children:this.state.userInfoSection}),Object(M.jsx)(ke.a,{in:!0,timeout:1e3,children:Object(M.jsxs)(b.a,{className:"user-track",style:{backgroundColor:""},children:[Object(M.jsx)(oe,{isChild:!1,controller:this}),Object(M.jsx)(oe,{isChild:!0,controller:this}),Object(M.jsx)(oe,{isChild:!0,controller:this})]})})]})}}]),n}(o.a.Component),De=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){return Object(i.a)(this,n),t.call(this,e)}return Object(a.a)(n,[{key:"startMatch",value:function(){this.props.router.updateContent(Object(M.jsx)(be,{router:this.props.router}))}},{key:"introduction",value:function(){this.props.router.updateContent(Object(M.jsx)(E,{router:this.props.router}))}},{key:"login",value:function(){this.props.router.updateContent(Object(M.jsx)(E,{router:this.props.router})),this.props.router.updateUserState()}},{key:"accountView",value:function(){this.props.router.updateContent(Object(M.jsx)(Pe,{router:this.props.router}))}},{key:"render",value:function(){var e=this;return Object(M.jsxs)("body",{className:"header-bar",children:[Object(M.jsxs)("div",{className:"header-left",children:[Object(M.jsx)(x.a,{onClick:function(){return e.startMatch()},children:"Match Now"}),Object(M.jsx)("button",{children:"Another leftttttttttttttttttttttttttttttt"}),Object(M.jsx)("button",{children:"Left"})]}),Object(M.jsx)(xe.a,{color:"#inherit",component:"button",className:"header-center",onClick:function(){return e.introduction()},children:"ruffmix"}),Object(M.jsxs)("div",{className:"header-right",children:[Object(M.jsx)(m.a,{color:"inherit",children:Object(M.jsx)(ve.a,{})}),Object(M.jsx)("div",{hidden:0!=this.props.router.getUserState(),children:Object(M.jsx)(x.a,{onClick:function(){return e.login()},children:"Login"})}),Object(M.jsxs)("div",{hidden:0==this.props.router.getUserState(),children:[Object(M.jsx)(m.a,{color:"inherit",onClick:function(){return e.accountView()},children:Object(M.jsx)(Oe.a,{})}),Object(M.jsxs)(fe.a,{children:[Object(M.jsx)(T.a,{children:"Profile"}),Object(M.jsx)(T.a,{children:"My account"})]})]})]})]})}}]),n}(o.a.Component),Te=n(195),Ie=(n(145),function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).updateUserState=function(){a.setState({userState:!0})},a.state={content:a.props.content,prevContent:"",nextContent:"",userState:!1},a.updateContent=a.updateContent.bind(Object(W.a)(a)),a.goToPrevious=a.goToPrevious.bind(Object(W.a)(a)),a.updateUserState=a.updateUserState.bind(Object(W.a)(a)),a.getUserState=a.getUserState.bind(Object(W.a)(a)),a}return Object(a.a)(n,[{key:"getUserState",value:function(){return this.state.userState}},{key:"componentDidMount",value:function(){this.setState({content:Object(M.jsx)(E,{router:this})})}},{key:"updateContent",value:function(e){var t=this.state.content;this.setState({content:e,prevContent:t})}},{key:"goToPrevious",value:function(){this.setState({content:this.state.prevContent})}},{key:"render",value:function(){return Object(M.jsxs)("div",{children:[Object(M.jsx)(De,{router:this}),Object(M.jsx)(f.a,{in:!0,children:Object(M.jsx)(Te.a,{className:"main-window-card",children:this.state.content})})]})}}]),n}(o.a.Component)),Re=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(a.a)(n,[{key:"render",value:function(){return Object(M.jsx)("body",{className:"maintitle",children:"ruffmix"})}}]),n}(o.a.Component),Ae=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={},a}return Object(a.a)(n,[{key:"render",value:function(){return Object(M.jsxs)("div",{children:[Object(M.jsx)("main",{className:"main-panel",children:Object(M.jsxs)("div",{children:[Object(M.jsx)(h,{}),Object(M.jsx)(Re,{})]})}),Object(M.jsx)(Ie,{})]})}}]),n}(o.a.Component);d.a.render(Object(M.jsx)(Ae,{}),document.getElementById("root"))},88:function(e,t,n){}},[[146,1,2]]]);
//# sourceMappingURL=main.990ab5d1.chunk.js.map