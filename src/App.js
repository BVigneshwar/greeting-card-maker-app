import React from 'react';
import html2canvas from 'html2canvas';
import ContentEditable from 'react-contenteditable';
import noColorIcon from './icons/no-color-icon.png';

function copyOf(obj) {
	var jsonObject = JSON.stringify(obj);
	return JSON.parse(jsonObject);
}

function loadImage(file, onload) {
	let type = file.type;
	if(!((type === "image/jpeg") || (type === "image/png") || (type === "image/jpg"))){
		alert("Invalid File Extension. Expected formats : jpeg, png or jpg");
	}else{
		let reader = new FileReader();
		reader.onload = (e) => { onload(e.target.result) };
		reader.readAsDataURL(file);
	}
}

function preventDefault(event) {
	event.preventDefault();
}


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			backgroundSize : "1 x 1",
			backgroundImage : "",
			backgroundColor : "#FFFFFF",
			backgroundImageSize : "cover",
			addIconClicked : false,
			backgrounIconClicked : false,
			backgroundColorOverlay : false,
			addTextOverlay : false,
			textArray : [],
			imageArray : [],
			selectedDraggable : undefined
		};
		this.container = React.createRef();
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleDraggableClick = this.handleDraggableClick.bind(this);
		this.handleTextSave = this.handleTextSave.bind(this);
		this.handleImageSave = this.handleImageSave.bind(this);
		
		this.state.touchDiff = 0;
		this.appElem = React.createRef();
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
	}
	
	handleChange(event) {
		event.stopPropagation();
		
		if(event.target.dataset.name === "addBackground") {
			this.setState({ backgrounIconClicked : !this.state.backgrounIconClicked });
		}
		
		if(event.target.name === "addBackgroundImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				loadImage(file, (response) => { this.setState({backgroundImage : "url("+response+")"}) });
			}
		}
		
		if(event.target.dataset.name === "addBackgroundColor") {
			this.setState({ backgroundColorOverlay : true });
		}
		
		if(event.target.dataset.name === "backgroundSize") {
			var backgroundSize = "1 x 1";
			if(event.target.dataset.value === "1 x 1") {
				backgroundSize = "3 x 4";
			}else if(event.target.dataset.value === "3 x 4") {
				backgroundSize = "9 x 16"
			}
			this.setState({ backgroundSize : backgroundSize });
		}
		
		if(event.target.dataset.name === "add") {
			this.setState({ addIconClicked : !this.state.addIconClicked });
		}
		
		if(event.target.dataset.name === "edit") {
			this.setState({ addTextOverlay : true, backgrounIconClicked : false });
		}
		
		if(event.target.name === "addImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				loadImage(file, (response) => {
					let image = {
						id : ""+Date.now(),
						style : {
							width : 1,
							transform : "rotate(0deg)"
						},
						filter : {
							blur : "0px",
							brightness : "100%",
							contrast : "100%",
							dropShadow : "0px 0px 0px gray",
							grayscale : "0%",
							hueRotate : "0deg",
							invert : "0%",
							opacity : "100%",
							saturate : "1",
							sepia : "0%"
						},
						crop : {
							top : "0px",
							left : "0px",
							right : "0px",
							bottom : "0px"
						},
						image : response
					};
					this.handleImageSave(image);
				});
			}
		}
		
		if(event.target.dataset.name === "addText") {
			this.setState({ addTextOverlay : true, addIconClicked : false, backgrounIconClicked : false });
		}
		
		if(event.target.dataset.name === "style") {
			this.setState({ [event.target.dataset.prop] : event.target.dataset.value });
		}
		
		if(event.target.name === "rotate") {
			let selectedDraggable = this.state.textArray.find((text) => text.id === this.state.selectedDraggable );
			if(selectedDraggable) {
				let textArray = copyOf(this.state.textArray).map((text) => {
					if(text.id === this.state.selectedDraggable) {
						text.style.transform = "rotate(" + event.target.value + "deg)";
					}
					return text;
				});
				this.setState({ textArray : textArray });
			}
			if(!selectedDraggable) {
				selectedDraggable = this.state.imageArray.find((image) => image.id === this.state.selectedDraggable );
				let imageArray = copyOf(this.state.imageArray).map((image) => {
					if(image.id === this.state.selectedDraggable) {
						image.style.transform = "rotate(" + event.target.value + "deg)";
					}
					return image;
				});
				this.setState({ imageArray : imageArray });
			}
		}
		
		if(event.target.name === "size") {
			let selectedDraggable = this.state.textArray.find((text) => text.id === this.state.selectedDraggable );
			if(selectedDraggable) {
				let textArray = copyOf(this.state.textArray).map((text) => {
					if(text.id === this.state.selectedDraggable) {
						text.style.fontSize = event.target.value + "px";
					}
					return text;
				});
				this.setState({ textArray : textArray });
			}
			if(!selectedDraggable) {
				selectedDraggable = this.state.imageArray.find((image) => image.id === this.state.selectedDraggable );
				let imageArray = copyOf(this.state.imageArray).map((image) => {
					if(image.id === this.state.selectedDraggable) {
						image.style.width = event.target.value;
					}
					return image;
				});
				this.setState({ imageArray : imageArray });
			}
		}
		
		if(event.target.dataset.name === "delete") {
			let selectedDraggable = this.state.textArray.find((text) => text.id === this.state.selectedDraggable );
			if(selectedDraggable) {
				let textArray = copyOf(this.state.textArray).filter((text) => {
					return text.id !== this.state.selectedDraggable;
				});
				this.setState({ textArray : textArray, selectedDraggable : undefined });
			}
			if(!selectedDraggable) {
				let imageArray = copyOf(this.state.imageArray).filter((image) => {
					return image.id !== this.state.selectedDraggable;
				});
				this.setState({ imageArray : imageArray, selectedDraggable : undefined });
			}
		}
	}
	
	handleClick(event) {
		event.stopPropagation();
		if(event.target.classList.contains("draggable")) {
			this.setState({addIconClicked : false, backgrounIconClicked : false, backgroundColorOverlay : false});
		}else {
			this.setState({addIconClicked : false, backgrounIconClicked : false, backgroundColorOverlay : false, selectedDraggable : undefined});
		}
	}
	
	handleDraggableClick(id) {
		this.setState({ selectedDraggable : id });
	}
	
	handleDownload() {
		html2canvas(document.querySelector(".greeting-background")).then(canvas => {
			var a = document.createElement('a'); 
			a.download = "greeting-card.png"; 
			a.href =  canvas.toDataURL();
			a.click();
		});
	}
	
	handleImageSave(image) {
		if(!image) {
			this.setState({addTextOverlay : false});
		} else {
			let imageArray = copyOf(this.state.imageArray);
			let isPresent = false;
			imageArray = imageArray.map((i) => {
				if(i.id === image.id) {
					isPresent = true;
					image.style.width = i.style.width;
					image.style.transform = i.style.transform;
					return image;
				}
				return i;
			});
			if(!isPresent) {
				imageArray.push(image);
			}
			this.setState({imageArray : imageArray, addTextOverlay : false});
		}
	}
	
	handleTextSave(text) {
		if(!text) {
			this.setState({addTextOverlay : false});
		} else {
			let textArray = copyOf(this.state.textArray);
			let isPresent = false;
			textArray = textArray.map((t) => {
				if(t.id === text.id) {
					isPresent = true;
					text.style.fontSize = t.style.fontSize;
					text.style.transform = t.style.transform;
					return text;
				}
				return t;
			});
			if(!isPresent) {
				text.style.fontSize = "20px";
				text.style.transform = "rotate(0deg)";
				textArray.push(text);
			}
			this.setState({textArray : textArray, addTextOverlay : false});
		}
	}
	
	componentDidMount() {
		document.body.addEventListener("touchmove", preventDefault);
	}
	
	componentWillUnmount() {
		document.body.removeEventListener("touchmove", preventDefault);
	}
	
	handleTouchStart(event) {
		if(this.state.selectedDraggable && event.touches.length == 2) {
			let pos1 = event.touches[0].clientY;
			let pos2 = event.touches[1].clientY;
			let diff = pos1 > pos2 ? parseInt(pos1 - pos2) : parseInt(pos2 - pos1);
			this.setState({ touchDiff : diff });
			this.appElem.current.ontouchmove = this.handleTouchMove;
			this.appElem.current.ontouchend = this.handleTouchEnd;
		}
	}
	
	handleTouchMove(event) {
		if(this.state.selectedDraggable && event.touches.length == 2) {
			let pos1 = event.touches[0].clientY;
			let pos2 = event.touches[1].clientY;
			let currDiff = pos1 > pos2 ? parseInt(pos1 - pos2) : parseInt(pos2 - pos1);
			let diff = currDiff - this.state.touchDiff;
			let selectedDraggable = this.state.textArray.find((text) => text.id === this.state.selectedDraggable );
			if(selectedDraggable) {
				let textArray = copyOf(this.state.textArray).map((text) => {
					if(text.id === this.state.selectedDraggable) {
						let value = parseInt(text.style.fontSize) + diff;
						if(value < 5) {
							value = 5;
						}else if(value > 100) {
							value = 100;
						}
						text.style.fontSize = value + "px";
					}
					return text;
				});
				this.setState({ textArray : textArray, touchDiff : currDiff });
			}
			if(!selectedDraggable) {
				selectedDraggable = this.state.imageArray.find((image) => image.id === this.state.selectedDraggable );
				let imageArray = copyOf(this.state.imageArray).map((image) => {
					if(image.id === this.state.selectedDraggable) {
						let value = parseFloat(image.style.width) + diff/10000;
						if(value < 0.2) {
							value = 0.5;
						}else if(value > 2) {
							value = 2;
						}
						image.style.width = value;
					}
					return image;
				});
				this.setState({ imageArray : imageArray });
			}
		}
	}
	
	handleTouchEnd() {
		this.appElem.current.ontouchmove = null;
		this.appElem.current.ontouchend = null;
	}
	
	render() {
		var [width, height] = this.state.backgroundSize.split(" x ");
		if(document.body.offsetWidth < document.body.offsetHeight) {
			height = ((height * 100)/width) + "vmin";
			width = "100vmin";
		} else {
			width = ((width * 100)/height) + "vmin";
			height = "100vmin";
		}
		
		let backgroundStyle = {
			width : width,
			height : height,
			backgroundImage : this.state.backgroundImage,
			backgroundColor : this.state.backgroundColor,
			backgroundSize : this.state.backgroundImageSize,
			backgroundRepeat : "no-repeat",
			backgroundPosition : "center"
		}
		
		let textElements = this.state.textArray.map((data) => <DraggableComponent key={data.id} id={data.id} selected={data.id === this.state.selectedDraggable} container={this.container} handleDraggableClick={this.handleDraggableClick} style={data.style} fontColorStyle={data.fontColorStyle} fontGradientColor={data.fontGradientColor} fontImage={data.fontImage} backgroundColorStyle={data.backgroundColorStyle} backgroundGradientColor={data.backgroundGradientColor} backgroundImage={data.backgroundImage} text={data.text} /> );
		let imageElements = this.state.imageArray.map((data) => <DraggableComponent key={data.id} id={data.id} selected={data.id === this.state.selectedDraggable} container={this.container} handleDraggableClick={this.handleDraggableClick} style={data.style} filter={data.filter} crop={data.crop} image={data.image} /> );
		
		let selectedDraggable, selectedImage = false;
		if(this.state.selectedDraggable) {
			selectedDraggable = this.state.textArray.find((text) => text.id === this.state.selectedDraggable );
			if(!selectedDraggable) {
				selectedDraggable = this.state.imageArray.find((image) => image.id === this.state.selectedDraggable );
				if(selectedDraggable) {
					selectedImage = true;
				}
			}
		}
		
		return (
			<div className="App" ref={this.appElem} onTouchStart={this.handleTouchStart}>
				<button data-name="addBackground" className="absolute top-margin left-margin round-button" onClick={this.handleChange}>
					<div data-name="addBackground" className="add-background-icon"></div>
				</button>
				{ this.state.backgrounIconClicked && <>
				<button data-name="addBackgroundColor" className="absolute left-margin round-button" style={{top:"60px"}} onClick={this.handleChange}>
					<div data-name="addBackgroundColor" className="add-background-icon add-background-color-icon"></div>
				</button>
				<input id="backgroundImage" hidden type="file" name="addBackgroundImage" accept = "image/*" onChange={this.handleChange} />
				<label className="absolute left-margin round-button" style={{top:"110px"}} htmlFor="backgroundImage">
					<div className="add-image-icon"></div>
				</label>
				</>}
				
				<div className="absolute background-size top-margin pointer" data-name="backgroundSize" onClick={this.handleChange} data-value={this.state.backgroundSize}>{this.state.backgroundSize}</div>
				
				<button className="absolute top-margin right-margin round-button" onClick={this.handleDownload}>
					<div className="save-icon"></div>
				</button>
				
				{!this.state.addTextOverlay && this.state.selectedDraggable && 
				<button data-name="delete" className="absolute right-margin round-button" style={{top:"60px"}} onClick={this.handleChange}>
					<div data-name="delete" className="delete-icon"></div>
				</button> }
				
				{this.state.selectedDraggable ?
				(<button data-name="edit" className="absolute bottom-margin right-margin round-button" onClick={this.handleChange}>
					<div data-name="edit" className="edit-icon"></div>
				</button>) : 
				(<button data-name="add" className="absolute bottom-margin right-margin round-button" onClick={this.handleChange}>
					<div data-name="add" className="add-icon"></div>
				</button>) }
				
				{ this.state.addIconClicked && <>
				<input id="addImage" hidden type="file" name="addImage" accept = "image/*" onChange={this.handleChange} />
				<label className="absolute right-margin round-button" style={{bottom:"110px"}} htmlFor="addImage">
					<div className="add-image-icon"></div>
				</label>
				<button data-name="addText" className="absolute right-margin round-button" style={{bottom:"60px"}} onClick={this.handleChange}>
					<div data-name="addText" className="add-text-icon"></div>
				</button>
				</> }
				
				<div className="greeting-container" onClick={this.handleClick}>
					<div className="greeting-background" style={backgroundStyle} ref={this.container}>
						{imageElements}
						{textElements}
					</div>
				</div>
				
				{ this.state.addTextOverlay && (selectedImage ? <ImageConfigComponent data={selectedDraggable} onSave={this.handleImageSave} /> : <TextComponent data={selectedDraggable} onSave={this.handleTextSave}/>) }
				{ this.state.backgroundColorOverlay && <BackgroundConfigComponent backgroundColor={this.state.backgroundColor} backgroundImageSize={this.state.backgroundImageSize} handleChange={this.handleChange} /> }
				{ !this.state.addTextOverlay && this.state.selectedDraggable &&  selectedDraggable && <DraggableConfigComponent rotate={selectedDraggable.style.transform} size={selectedDraggable.style.fontSize ? selectedDraggable.style.fontSize.replace("px", "") : selectedDraggable.style.width} maxSize={selectedDraggable.style.fontSize ? "50" : "2"} minSize={selectedDraggable.style.fontSize ? "1" : "0.2"} step={selectedDraggable.style.fontSize ? "1" : "0.1"} handleChange={this.handleChange} /> }
			</div>
		);
	}
}

class BackgroundConfigComponent extends React.Component {
	render() {
		return (
			<div className="config-background config-container">
				<ColorPicker color={this.props.backgroundColor} property="backgroundColor" handleChange={this.props.handleChange} />
				<div className="config-menu-container">
					<div className={this.props.backgroundImageSize === "contain" ? "background-image-size-button selected" : "background-image-size-button"} data-name="style" data-prop="backgroundImageSize" data-value="contain" onClick={this.props.handleChange}>Original</div>
					<div className={this.props.backgroundImageSize === "cover" ? "background-image-size-button selected" : "background-image-size-button"} data-name="style" data-prop="backgroundImageSize" data-value="cover" onClick={this.props.handleChange}>Stretch</div>
				</div>
			</div>
		);
	}
}

class DraggableConfigComponent extends React.Component {
	render() {
		return (
			<div className="config-container" style={{right : "80px"}}>
				<div className="draggable-config-container">
					<RangeComponent name="size" label="Size" value={this.props.size} convertToPercent="true" suffix="%" min={this.props.minSize} max={this.props.maxSize} step={this.props.step} handleChange={this.props.handleChange} />
					<RangeComponent name="rotate" label="Rotate" value={this.props.rotate.replace("rotate(", "").replace("deg)", "")} suffix="deg" min="-180" max="180" handleChange={this.props.handleChange} />
				</div>
			</div>
		);
	}
}

class DraggableComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			currX : 0,
			currY : 0,
			prevX : 0,
			prevY : 0
		};
		this.elem = React.createRef();
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		
		this.leftLineElem = React.createRef();
		this.topLineElem = React.createRef();
		this.rightLineElem = React.createRef();
		this.bottomLineElem = React.createRef();
	}
	
	handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.container.current.onmouseup = this.handleMouseUp;
		this.props.container.current.onmousemove = this.handleDrag;
		this.props.container.current.ontouchend = this.handleMouseUp;
		this.props.container.current.ontouchmove = this.handleDrag;
		if(event.type === "touchstart" && event.touches.length === 1) {
			event = event.touches[0] || event.changedTouches[0];
		}
		this.setState({ prevX : event.clientX, prevY : event.clientY});
		this.elem.current.classList.add("grabbing");
		this.props.handleDraggableClick(this.elem.current.id);
	}
	
	handleDrag(event) {
		//event.preventDefault();
		event.stopPropagation();
		if(event.type === "touchmove" && event.touches.length === 1) {
			event = event.touches[0] || event.changedTouches[0];
		}
		let currX = this.state.prevX - event.clientX;
		let currY = this.state.prevY - event.clientY;
		let prevX = event.clientX;
		let prevY = event.clientY;
		this.setState({currX : currX, currY : currY, prevX : prevX, prevY : prevY});
	}
	
	handleMouseUp(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.container.current.onmouseup = null;
		this.props.container.current.onmousemove = null;
		this.props.container.current.ontouchend = null;
		this.props.container.current.ontouchmove = null;
		this.elem.current.classList.remove("grabbing");
		//this.props.handleDraggableClick(this.elem.current.id);
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		//if(this.state.currX !== prevState.currX || this.state.currY !== prevState.currY) {
			return {
				top : this.elem.current.offsetTop - this.state.currY,
				left : this.elem.current.offsetLeft - this.state.currX,
				width : this.elem.current.offsetWidth,
				height : this.elem.current.offsetHeight,
				containerWidth : this.props.container.current.offsetWidth,
				containerHeight : this.props.container.current.offsetHeight
			};
		//}
		//return null;
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if(snapshot && (this.state.currX !== prevState.currX || this.state.currY !== prevState.currY)) {
			if(snapshot.left < 0) {
				snapshot.left = 0;
			}
			if(snapshot.top < 0) {
				snapshot.top = 0;
			}
			if(snapshot.left + snapshot.width > snapshot.containerWidth) {
				snapshot.left = snapshot.containerWidth - snapshot.width;
			}
			if(snapshot.top + snapshot.height > snapshot.containerHeight) {
				snapshot.top = snapshot.containerHeight - snapshot.height;
			}
			this.elem.current.style.top = (snapshot.top*100/snapshot.containerHeight) + "%";
			this.elem.current.style.left = (snapshot.left*100/snapshot.containerWidth) + "%";
		}
		if(this.props.selected) {
			this.leftLineElem.current.style.top = (snapshot.top + snapshot.height/2) + "px";
			this.leftLineElem.current.style.width = snapshot.left + "px";
			this.leftLineElem.current.innerText = parseInt(snapshot.left) + "px";
			
			this.topLineElem.current.style.left = (snapshot.left + snapshot.width/2) + "px";
			this.topLineElem.current.style.height = snapshot.top + "px";
			this.topLineElem.current.innerHTML = "<div>"+ parseInt(snapshot.top) + "px</div>";
			
			this.rightLineElem.current.style.top = (snapshot.top + snapshot.height/2) + "px";
			this.rightLineElem.current.style.width = (snapshot.containerWidth - snapshot.left - snapshot.width) + "px";
			this.rightLineElem.current.innerText = parseInt(snapshot.containerWidth - snapshot.left - snapshot.width) + "px";
			
			this.bottomLineElem.current.style.left = (snapshot.left + snapshot.width/2) + "px";
			this.bottomLineElem.current.style.height = (snapshot.containerHeight - snapshot.top - snapshot.height) + "px";
			this.bottomLineElem.current.innerHTML = "<div>" + parseInt(snapshot.containerHeight - snapshot.top - snapshot.height) + "px</div>";
		}
	}
	
	componentDidMount() {
		this.elem.current.style.top = "calc(50% - " + (this.elem.current.offsetHeight/2) +"px )";
		this.elem.current.style.left = "calc(50% - " + (this.elem.current.offsetWidth/2) +"px )";
	}
	
	render() {
		let elem = null;
		debugger
		if(this.props.image) {
			elem = (<>
				<div id={this.props.id} style={{ transform : this.props.style.transform }} className={this.props.selected ? "draggable-selected absolute draggable" : "absolute draggable"} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} ref={this.elem}>
					<div className="draggable overflow-hidden" style={{transform : "scale("+this.props.style.width+")"}}>
						<img className="draggable" style={{ filter : mergeFilterStyle(this.props.filter), margin : mergeCropStyle(this.props.crop)}} src={this.props.image} alt="error"/>
						<div className="draggable selected-overlay"></div>
					</div>
				</div>
				{ this.props.selected && 
					<>
						<div ref={this.leftLineElem} className="left-dotted-line"></div>
						<div ref={this.topLineElem} className="top-dotted-line"></div>	
						<div ref={this.rightLineElem} className="right-dotted-line"></div>
						<div ref={this.bottomLineElem} className="bottom-dotted-line"></div>
					</>
				}
			</>);
		} else if(this.props.text) {
			
			let {fontSize, transform, backgroundColor, borderColor, borderWidth, borderStyle, borderRadius, textShadow, ...style} = this.props.style;
			if(this.props.fontColorStyle === "gradient") {
				style.backgroundImage = this.props.fontGradientColor;
			}else if(this.props.fontColorStyle === "image") {
				style.backgroundImage = this.props.fontImage;
			}
			let backgroundStyle = {backgroundColor, borderColor, borderWidth, borderStyle, borderRadius};
			if(this.props.backgroundColorStyle === "gradient") {
				backgroundStyle.backgroundImage = this.props.backgroundGradientColor;
			}else if(this.props.backgroundColorStyle === "image") {
				backgroundStyle.backgroundImage = this.props.backgroundImage;
			}
			elem = ( <>
				<div id={this.props.id} style={{fontSize, transform}} className={this.props.selected ? "draggable-selected absolute draggable" : "absolute draggable"} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} ref={this.elem}>
					<div style={style} className={this.props.fontColorStyle !== "normal" ? "background-font draggable" : "draggable"}>
						<div className="text-background" style={backgroundStyle}></div>
						<div style={{textShadow : textShadow, padding : style.padding}} className="text-shadow">{this.props.text}</div>
						<div className="draggable">{this.props.text}</div>
						<div className="draggable selected-overlay"></div>
					</div>
				</div>
				{ this.props.selected && 
					<>
						<div ref={this.leftLineElem} className="left-dotted-line"></div>
						<div ref={this.topLineElem} className="top-dotted-line"></div>	
						<div ref={this.rightLineElem} className="right-dotted-line"></div>
						<div ref={this.bottomLineElem} className="bottom-dotted-line"></div>
					</>
				}
			</> );
			
		}
		
		return elem;
	}
}


class TextComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id : ""+Date.now(),
			text : "",
			style : {
				position : "relative",
				textAlign : "center",
				fontFamily : "Times New Roman",
				color : "#000000",
				fontStyle : "normal",
				fontWeight : "normal",
				textDecoration : "none",
				textShadow : "1px 1px 2px transparent",
				backgroundColor : "transparent",
				padding : "3px",
				borderColor : "transparent",
				borderStyle : "solid",
				borderWidth : "0px",
				borderRadius : "0px",
				whiteSpace : "pre-wrap"
			},
			selectedOption : "",
			selectedFontGradient : "top",
			fontColorStyle : "normal",
			fontGradientColor : "linear-gradient(#9C27B0,#03A9F4)",
			fontImage : "linear-gradient(to left, violet, indigo, green, blue, yellow, orange, red)",
			selectedBackgroundGradient : "top",
			backgroundColorStyle : "normal",
			backgroundGradientColor : "linear-gradient(#D1C4E9,#B2EBF2)",
			backgroundImage : "linear-gradient(to left, #673AB7, #2196F3, #4CAF50, #00BCD4, #FFEB3B, #FF9800, #FF5722)",
			
		}
		if(props.data) {
			this.state = copyOf(props.data);
			this.state.style.transform = undefined;
			this.state.style.fontSize = undefined;
			this.state.selectedOption = "";
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}
	
	handleClick(event) {
		if(event.currentTarget.dataset.name === "selectedOption") {
			if(this.state.selectedOption === event.currentTarget.dataset.value) {
				this.setState({selectedOption : ""});
			} else {
				this.setState({ selectedOption : event.currentTarget.dataset.value});
			}	
		}else if(event.currentTarget.dataset.name === "fontColorStyle") {
			this.setState({fontColorStyle : event.currentTarget.dataset.value});
		}else if(event.currentTarget.dataset.name === "selectedFontGradient") {
			this.setState({selectedFontGradient : event.currentTarget.dataset.value});
		}else if(event.currentTarget.name === "fontImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				loadImage(file, (response) => { this.setState({fontImage : "url("+response+")"}) });
			}
		}else if(event.currentTarget.dataset.name === "backgroundColorStyle") {
			this.setState({backgroundColorStyle : event.currentTarget.dataset.value});
		}else if(event.currentTarget.dataset.name === "selectedBackgroundGradient") {
			this.setState({selectedBackgroundGradient : event.currentTarget.dataset.value});
		}else if(event.currentTarget.name === "backgroundImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				loadImage(file, (response) => { this.setState({backgroundImage : "url("+response+")"}) });
			}
		}else if(event.currentTarget.dataset.name === "ok") {
			let data = copyOf(this.state);
			this.props.onSave(data);
		}else if(event.currentTarget.dataset.name === "cancel") {
			this.props.onSave();
		}else{
			this.setState({selectedOption : ""});
		}
	}
	
	handleChange(event) {
		if(event.currentTarget.name === "style") {
			let style = copyOf(this.state.style);
			if(event.currentTarget.dataset.prop.includes("textShadow")) {
				let [textShadowLeft, textShadowTop, textShadowBlur, textShadowColor] = style.textShadow.split(" ");
				let obj = {textShadowLeft, textShadowTop, textShadowBlur, textShadowColor};
				obj[event.currentTarget.dataset.prop] = event.currentTarget.value + "px";
				style.textShadow = [obj.textShadowLeft, obj.textShadowTop, obj.textShadowBlur, obj.textShadowColor].join(" ");
			}else{
				style[event.currentTarget.dataset.prop] = event.currentTarget.value + "px";
			}
			this.setState({ style : style });
		}else if(event.currentTarget.dataset.name === "style") {
			
			if(event.currentTarget.dataset.prop === "fontGradientTop" || event.currentTarget.dataset.prop === "fontGradientBottom") {
				let gradient = this.state.fontGradientColor.replace("linear-gradient(", "").replace(")", "").split(",");
				gradient[event.currentTarget.dataset.prop === "fontGradientTop" ? 0 : 1] = event.currentTarget.dataset.value;
				this.setState({fontGradientColor : "linear-gradient("+gradient[0]+","+gradient[1]+")"});
			} else if(event.currentTarget.dataset.prop === "backgroundGradientTop" || event.currentTarget.dataset.prop === "backgroundGradientBottom") {
				let gradient = this.state.backgroundGradientColor.replace("linear-gradient(", "").replace(")", "").split(",");
				gradient[event.currentTarget.dataset.prop === "backgroundGradientTop" ? 0 : 1] = event.currentTarget.dataset.value;
				this.setState({backgroundGradientColor : "linear-gradient("+gradient[0]+","+gradient[1]+")"});
			} else if(event.currentTarget.dataset.prop.includes("textShadow")) {
				let style = copyOf(this.state.style);
				let [textShadowLeft, textShadowTop, textShadowBlur, textShadowColor] = style.textShadow.split(" ");
				let obj = {textShadowLeft, textShadowTop, textShadowBlur, textShadowColor};
				obj[event.currentTarget.dataset.prop] = event.currentTarget.dataset.value;
				style.textShadow = [obj.textShadowLeft, obj.textShadowTop, obj.textShadowBlur, obj.textShadowColor].join(" ");
				this.setState({ style : style });
			} else {
				let style = copyOf(this.state.style);
				style[event.currentTarget.dataset.prop] = event.currentTarget.dataset.value;
				this.setState({ style : style });
			}
		}
	}
	
	handleTextChange(event) {
		this.setState({ text : event.currentTarget.innerText});
	}
	
	render() {
		let colorStyleProps = {
			fontColorStyle : this.state.fontColorStyle,
			selectedFontGradient : this.state.selectedFontGradient,
			fontGradientColor : this.state.fontGradientColor,
			fontImage : this.state.fontImage,
			backgroundColorStyle : this.state.backgroundColorStyle,
			selectedBackgroundGradient : this.state.selectedBackgroundGradient,
			backgroundGradientColor : this.state.backgroundGradientColor,
			backgroundImage : this.state.backgroundImage
		};
		
		return (
			<div className="overlay" onClick={this.handleClick}>
				<button data-name="ok" className="absolute top-margin right-margin round-button" onClick={this.handleClick}>
					<div className="ok-icon"></div>
				</button>
				<button data-name="cancel" className="absolute top-margin left-margin round-button" onClick={this.handleClick}>
					<div className="cancel-icon"></div>
				</button>
				<div className="screen-center" spellCheck="false">
					<InputTextComponent style={this.state.style} selectedOption={this.state.selectedOption} text={this.state.text} handleTextChange={this.handleTextChange} {...colorStyleProps}/>
				</div>
				<TextConfigComponent selectedOption={this.state.selectedOption} handleClick={this.handleClick} handleChange={this.handleChange} {...this.state.style} {...colorStyleProps}/>
			</div>
		);
	}
}

class InputTextComponent extends React.Component {
	constructor(props) {
		super(props);
		this.textField = React.createRef();
	}
	
	componentDidMount() {
		if(!this.props.selectedOption) {
			this.textField.current.getEl().focus();
		}
	}
	
	componentDidUpdate() {
		if(!this.props.selectedOption) {
			this.textField.current.getEl().focus();
		}
	}
	
	render() {
		let {backgroundColor, borderColor, borderWidth, borderStyle, borderRadius, textShadow, ...style} = this.props.style;
		
		if(this.props.fontColorStyle === "gradient") {
			style.backgroundImage = this.props.fontGradientColor;
		}else if(this.props.fontColorStyle === "image") {
			style.backgroundImage = this.props.fontImage;
		}
		let backgroundStyle = {backgroundColor, borderColor, borderWidth, borderStyle, borderRadius};
		if(this.props.backgroundColorStyle === "gradient") {
			backgroundStyle.backgroundImage = this.props.backgroundGradientColor;
		}else if(this.props.backgroundColorStyle === "image") {
			backgroundStyle.backgroundImage = this.props.backgroundImage;
		}
		return (
			<div className="input-text-wrapper">
				<div style={style} className={this.props.fontColorStyle !== "normal" ? "background-font" : ""}>
					<div style={backgroundStyle} className="text-background"></div>
					<div style={{textShadow : textShadow, padding : style.padding}} className="text-shadow editable">{this.props.text}</div>
					<ContentEditable className="editable" ref={this.textField} onChange={this.props.handleTextChange} html={this.props.text} />
				</div>
			</div>
		);
	}
}

class TextConfigComponent extends React.Component {
	render() {
		let backgroundGradient = this.props.backgroundGradientColor.replace("linear-gradient(", "").replace(")", "").split(",");
		let fontGradient = this.props.fontGradientColor.replace("linear-gradient(", "").replace(")", "").split(",");
		let [textShadowLeft, textShadowTop, textShadowBlur, textShadowColor] = this.props.textShadow.split(" ");
		return (
			<div className={this.props.selectedOption !== "" ? "config-background config-container" : "config-container"} onClick={(e) => e.stopPropagation()}>
				{this.props.selectedOption === "font-config" && 
					<div>
						<TextAlignPicker textAlign={this.props.textAlign} handleChange={this.props.handleChange} />
						<FontPicker fontFamily={this.props.fontFamily} handleChange={this.props.handleChange} />
						<ColorStylePicker colorStyle={this.props.fontColorStyle} selectedGradient={this.props.selectedFontGradient} styleProperty="fontColorStyle" normal={{color : this.props.color, property : "color"}} gradient={{property : "selectedFontGradient", top : fontGradient[0], bottom : fontGradient[1], selectedGradient : this.props.selectedFontGradient, topProperty : "fontGradientTop", bottomProperty : "fontGradientBottom"}} image={{property : "fontImage", value : this.props.fontImage}} handleClick={this.props.handleClick} handleChange={this.props.handleChange}/>
						<FontStylePicker fontStyle={this.props.fontStyle} fontWeight={this.props.fontWeight} textDecoration={this.props.textDecoration} handleChange={this.props.handleChange} />
					</div>
				}
				{this.props.selectedOption === "text-shadow-config" && 
					<div>
						<ColorPicker color={textShadowColor} transparent="true" property="textShadowColor" handleChange={this.props.handleChange} />
						<RangeComponent name="style" property="textShadowLeft" label="Left" value={textShadowLeft.replace("px", "")} suffix="px" min="-20" max="20" handleChange={this.props.handleChange} />
						<RangeComponent name="style" property="textShadowTop" label="Top" value={textShadowTop.replace("px", "")} suffix="px" min="-20" max="20" handleChange={this.props.handleChange} />
						<RangeComponent name="style" property="textShadowBlur" label="Blur" value={textShadowBlur.replace("px", "")} suffix="%" min="0" max="20" handleChange={this.props.handleChange} />
					</div>
				}
				{this.props.selectedOption === "background-config" && 
					<div>
						<ColorStylePicker colorStyle={this.props.backgroundColorStyle} selectedGradient={this.props.selectedBackgroundGradient} styleProperty="backgroundColorStyle" normal={{color : this.props.backgroundColor, property : "backgroundColor", transparent : true}} gradient={{property : "selectedBackgroundGradient", top : backgroundGradient[0], bottom : backgroundGradient[1], selectedGradient : this.props.selectedBackgroundGradient, topProperty : "backgroundGradientTop", bottomProperty : "backgroundGradientBottom"}} image={{property : "backgroundImage", value : this.props.backgroundImage}} handleClick={this.props.handleClick} handleChange={this.props.handleChange}/>
						<RangeComponent name="style" property="padding" label="Size" value={this.props.padding.replace("px", "")} suffix="px" min="0" max="50" handleChange={this.props.handleChange} />
					</div>
				}
				{this.props.selectedOption === "border-config" && 
					<div>
						<ColorPicker color={this.props.borderColor} property="borderColor" transparent="true" handleChange={this.props.handleChange} />
						<BorderStylePicker borderStyle={this.props.borderStyle} handleChange={this.props.handleChange}/>
						<RangeComponent name="style" property="borderWidth" label="Size" value={this.props.borderWidth.replace("px", "")} suffix="px" min="0" max="10" handleChange={this.props.handleChange} />
						<RangeComponent name="style" property="borderRadius" label="Radius" value={this.props.borderRadius.replace("px", "")} suffix="px" min="0" max="100" handleChange={this.props.handleChange} />
					</div>
				}
				<div className="config-menu-container">
					<div data-name="selectedOption" data-value="font-config" className={this.props.selectedOption === "font-config" ? "selected" : ""} onClick={this.props.handleClick}>Font</div>
					<div data-name="selectedOption" data-value="text-shadow-config" className={this.props.selectedOption === "text-shadow-config" ? "selected" : ""} onClick={this.props.handleClick}>Shadow</div>
					<div data-name="selectedOption" data-value="background-config" className={this.props.selectedOption === "background-config" ? "selected" : ""} onClick={this.props.handleClick}>Background</div>
					<div data-name="selectedOption" data-value="border-config" className={this.props.selectedOption === "border-config" ? "selected" : ""} onClick={this.props.handleClick}>Border</div>
				</div>
			</div>
		);
	}
}

class TextAlignPicker extends React.Component {
	render() {
		return (
			<div className="text-align-picker-container">
				<div className={this.props.textAlign === "left" ? "left-align-button selected" : "left-align-button"} data-name="style" data-prop="textAlign" data-value="left" onClick={this.props.handleChange}></div>
				<div className={this.props.textAlign === "center" ? "center-align-button selected" : "center-align-button"} data-name="style" data-prop="textAlign" data-value="center" onClick={this.props.handleChange}></div>
				<div className={this.props.textAlign === "right" ? "right-align-button selected" : "right-align-button"} data-name="style" data-prop="textAlign" data-value="right" onClick={this.props.handleChange}></div>
			</div>
		);
	}
}

const FONT = ["Times New Roman", "Caveat", "Codystar", "Comfortaa", "Cookie", "Courgette", "Crafty Girls", "Dancing Script", "Gloria Hallelujah", "Handlee", "Limelight", "Luckiest Guy", "Lobster", "Monoton", "Pacifico", "Permanent Marker", "Sacramento", "Source Code Pro"]
class FontPicker extends React.Component {
	render() {
		var fontElements = FONT.map((font, index) => {
			return <div key={index} data-name="style" data-prop="fontFamily" data-value={font} className={this.props.fontFamily === font ? "font-button selected" : "font-button"} style={{fontFamily : font}} onClick={this.props.handleChange}>Aa</div>;
		});
		return (
			<div className="font-picker-container">
				{fontElements}
			</div>
		);
	}
}

class ColorStylePicker extends React.Component {
	render() {
		return (
		<>
			<div>
				<div data-name={this.props.styleProperty} data-value="normal" className={this.props.colorStyle === "normal" ? "color-style-button selected" : "color-style-button"} onClick={this.props.handleClick}>
					<div className="color-button" style={this.props.normal.color == "transparent" ? {backgroundImage : "url("+noColorIcon+")"} : {backgroundColor : this.props.normal.color}}></div>
					<div>Color</div>
				</div>
				<div data-name={this.props.styleProperty} data-value="gradient" className={this.props.colorStyle === "gradient" ? "color-style-button selected" : "color-style-button"} onClick={this.props.handleClick}>
					<div className="color-button" style={{backgroundImage : "linear-gradient("+this.props.gradient.top+","+this.props.gradient.bottom+")"}}></div>
					<div>Gradient</div>
				</div>
				<div data-name={this.props.styleProperty} data-value="image" className={this.props.colorStyle === "image" ? "color-style-button selected" : "color-style-button"} onClick={this.props.handleClick}>
					<div className="color-button" style={{backgroundImage : this.props.image.value}}></div>
					<div>Image</div>
				</div>
			</div>
			{ this.props.colorStyle === "normal" && <ColorPicker color={this.props.normal.color} transparent={this.props.normal.transparent} property={this.props.normal.property} handleChange={this.props.handleChange} /> }
			{ this.props.colorStyle === "gradient" && 
				<div>
					<div data-name={this.props.gradient.property} data-value="top" className={this.props.selectedGradient === "top" ? "color-style-button selected" : "color-style-button"} onClick={this.props.handleClick}>
						<div className="color-button" style={{backgroundColor : this.props.gradient.top}}></div>
						<div>Top</div>
					</div>
					<div data-name={this.props.gradient.property} data-value="bottom" className={this.props.selectedGradient === "bottom" ? "color-style-button selected" : "color-style-button"} onClick={this.props.handleClick}>
						<div className="color-button" style={{backgroundColor : this.props.gradient.bottom}}></div>
						<div>Bottom</div>
					</div>
					<ColorPicker color={this.props.selectedGradient === "top" ? this.props.gradient.top : this.props.gradient.bottom} property={this.props.selectedGradient === "top" ? this.props.gradient.topProperty : this.props.gradient.bottomProperty} handleChange={this.props.handleChange} />
				</div>
			}
			{ this.props.colorStyle === "image" && 
				<div>
					<input id="color-style-image" hidden type="file" name={this.props.image.property} accept = "image/*" onChange={this.props.handleClick} />
					<label htmlFor="color-style-image" className="font-image pointer">
						<div className="image-button" style={{backgroundImage : this.props.image.value}}>
							<div className="edit-icon"></div>
						</div>
					</label>
				</div>
			}
		</>
		);
	}
}

const COLORS = ["#000000", "#FFFFFF",
			"#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9", "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2", "#FFCCBC", "#D7CCC8", "#F5F5F5",
			"#EF5350", "#EC407A", "#AB47BC", "#7E57C2", "#5C6BC0", "#42A5F5", "#29B6F6", "#26C6DA", "#26A69A", "#66BB6A", "#9CCC65", "#D4E157", "#FFEE58", "#FFCA28", "#FFA726", "#FF7043", "#8D6E63", "#BDBDBD",
			"#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E",
			"#D32F2F", "#C2185B", "#7B1FA2", "#512DA8", "#303F9F", "#1976D2", "#0288D1", "#0097A7", "#00796B", "#388E3C", "#689F38", "#AFB42B", "#FBC02D", "#FFA000", "#F57C00", "#E64A19", "#5D4037", "#616161",
			"#B71C1C", "#880E4F", "#4A148C", "#311B92", "#1A237E", "#0D47A1", "#01579B", "#006064", "#004D40", "#1B5E20", "#33691E", "#827717", "#F57F17", "#FF6F00", "#E65100", "#BF360C", "#3E2723", "#212121"
			];
class ColorPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			leftClass : "left-scroll-button",
			rightClass : "right-scroll-button highlight"
		}
		this.container = React.createRef();
		this.handleScroll = this.handleScroll.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleScroll(event) {
		let className = {
			leftClass : "left-scroll-button",
			rightClass : "right-scroll-button"
		}
		if(this.container.current.scrollLeft > 50) {
			className.leftClass = "left-scroll-button highlight";
		}
		if(this.container.current.offsetWidth + this.container.current.scrollLeft < this.container.current.scrollWidth - 50) {
			className.rightClass  = "right-scroll-button highlight";
		}
		this.setState(className);
	}
	
	handleClick(event) {
		if(event.target.dataset.name === "scroll-left") {
			this.container.current.scroll({ left : this.container.current.scrollLeft - this.container.current.offsetWidth, behavior : "smooth" });
		}else if(event.target.dataset.name === "scroll-right") {
			this.container.current.scroll({ left : this.container.current.scrollLeft + this.container.current.offsetWidth, behavior : "smooth" });
		}
	}
	
	render() {
		var colorElements = COLORS.map((color, index) => {
			return <div key={index} data-name="style" data-prop={this.props.property} data-value={color} className={this.props.color === color ? "color-button selected" : "color-button"} style={{backgroundColor : color, borderColor : color}} onClick={this.props.handleChange}/>;
		});
		return (
			<div className="color-picker-wrapper">
				<div data-name="scroll-left" className={this.state.leftClass} onClick={this.handleClick}></div>
				<div className="color-picker-container" onScroll={this.handleScroll} ref={this.container}>
					{this.props.transparent && <div data-name="style" data-prop={this.props.property} data-value="transparent" className={this.props.color === "transparent" ? "no-color-icon-button selected" : "no-color-icon-button"} onClick={this.props.handleChange}/> }
					{colorElements}
				</div>
				<div data-name="scroll-right" className={this.state.rightClass} onClick={this.handleClick}></div>
			</div>
		);
	}
}

class FontStylePicker extends React.Component {
	render() {
		let italic = this.props.fontStyle === "normal" ? "italic" : "normal";
		let bold = this.props.fontWeight === "normal" ? "bold" : "normal";
		let underline = this.props.textDecoration === "none" ? "underline" : "none";
		return (
			<div className="picker-container">
				<div data-name="style" data-prop="fontStyle" data-value={italic} className={italic === "italic" ? "font-style-button" : "font-style-button selected"} onClick={this.props.handleChange} style={{fontStyle: "italic"}}>italic</div>
				<div data-name="style" data-prop="fontWeight" data-value={bold} className={bold === "bold" ? "font-style-button" : "font-style-button selected"} onClick={this.props.handleChange} style={{fontWeight: "bold"}}>bold</div>
				<div data-name="style" data-prop="textDecoration" data-value={underline} className={underline === "underline" ? "font-style-button" : "font-style-button selected"} onClick={this.props.handleChange} style={{textDecoration: "underline"}}>underline</div>
			</div>
		);
	}
}

class BorderStylePicker extends React.Component {
	render() {
		return (
			<div className="picker-container">
				<div data-name="style" data-prop="borderStyle" data-value="solid" className={this.props.borderStyle === "solid" ? "border-solid-button selected" : "border-solid-button"} onClick={this.props.handleChange}>solid</div>
				<div data-name="style" data-prop="borderStyle" data-value="dotted" className={this.props.borderStyle === "dotted" ? "border-dotted-button selected" : "border-dotted-button"} onClick={this.props.handleChange}>dotted</div>
				<div data-name="style" data-prop="borderStyle" data-value="dashed" className={this.props.borderStyle === "dashed" ? "border-dashed-button selected" : "border-dashed-button"} onClick={this.props.handleChange}>dashed</div>
				<div data-name="style" data-prop="borderStyle" data-value="double" className={this.props.borderStyle === "double" ? "border-double-button selected" : "border-double-button"} onClick={this.props.handleChange}>double</div>
			</div>
		);
	}
}

class RangeComponent extends React.Component {
	render() {
		let min = parseInt(this.props.min);
		let max = parseInt(this.props.max);
		let value = parseInt(this.props.value);
		value = parseInt((value - min)/(max - min) * 100);
		return (
			<div className="range-container">
				<div className="range-label">{this.props.label}</div>
				<input type="range" name={this.props.name} data-prop={this.props.property} value={this.props.value} min={this.props.min} max={this.props.max} step={this.props.step ? this.props.step : "1"} onChange={this.props.handleChange} />
				<div className="range-value">{this.props.convertToPercent ? value + this.props.suffix : this.props.value + this.props.suffix}</div>
			</div>
		);
	}
}

const IMAGE_FILTER_CONFIG = {
	blur : { label : "Blur", min : 0, max : 10, style : { filter: "blur(3px)" } },
	brightness : { label : "Brightness", min : 50, max : 200, style : { filter: "brightness(200%)" } },
	contrast : { label : "Contrast", min : 50, max : 200, style : { filter: "contrast(200%)" } },
	dropShadow : { label : "Shadow", min : 0, max : 20, style : { filter: "drop-shadow(2px 2px 2px gray)" } },
	grayscale : { label : "Gray Scale", min : 0, max : 100, style : { filter: "grayscale(100%)" } },
	hueRotate : { label : "Hue", min : 0, max : 360, style : { filter : "hue-rotate(45deg)" } },
	invert : { label : "Invert", min : 0, max : 100, style : { filter : "invert(100%)" } },
	opacity : { label : "Opacity", min : 0, max : 100, style : { filter : "opacity(50%)"} },
	saturate : { label : "Saturation", min : 1, max : 20, style : { filter : "saturate(5)"} },
	sepia : { label : "Sepia", min : 0, max : 100, style : { filter : "sepia(100%)"} }
}

function mergeFilterStyle(data) {
	let blur = "blur("+data.blur+")";
	let brightness = "brightness("+data.brightness+")";
	let contrast = "contrast("+data.contrast+")";
	let dropShadow = "drop-shadow("+data.dropShadow+")";
	let grayscale = "grayscale("+data.grayscale+")";
	let hueRotate = "hue-rotate("+data.hueRotate+")";
	let invert = "invert("+data.invert+")";
	let opacity = "opacity("+data.opacity+")";
	let saturate = "saturate("+data.saturate+")";
	let sepia = "sepia("+data.sepia+")";
	return [blur, brightness, contrast, grayscale, hueRotate, invert, opacity, saturate, sepia, dropShadow].join(" ");
}

function mergeCropStyle(crop) {
	return "-"+crop.top+" -"+crop.right+" -"+crop.bottom+" -"+crop.left;
}

class ImageConfigComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			crop : {},
			filter : {},
			selectedOption : "size-config",
			selectedFilter : "blur",
			selectedCrop : "",
			currX : 0,
			currY : 0,
			prevX : 0,
			prevY : 0
		};
		if(props.data) {
			Object.assign(this.state.filter, props.data.filter);
			Object.assign(this.state.crop, props.data.crop);
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		
		this.container = React.createRef();
		this.image = React.createRef();
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}
	
	handleClick(event) {
		if(event.currentTarget.dataset.name === "ok") {
			let data = copyOf(this.props.data);
			data.filter = this.state.filter;
			data.crop = this.state.crop;
			this.props.onSave(data);
		}else if(event.currentTarget.dataset.name === "cancel") {
			this.props.onSave();
		}else if(event.currentTarget.dataset.name === "selectedOption") {
			this.setState({ selectedOption : event.currentTarget.dataset.value });
		}else if(event.currentTarget.dataset.name === "selectedFilter") {
			this.setState({ selectedFilter : event.currentTarget.dataset.value });
		}
	}
	
	handleChange(event) {
		if(event.currentTarget.name === "filter") {
			let filter = copyOf(this.state.filter);
			let property = event.currentTarget.dataset.prop;
			let value = event.currentTarget.value;
			if(property === "blur") {
				value += "px";
			}else if(property === "dropShadow") {
				value += "px " + value + "px " + value + "px gray";
			}else if(property === "hueRotate") {
				value += "deg";
			}else if(property === "saturate") {
				value = value;
			}else{
				value += "%";
			}
			filter[property] = value;
			this.setState({ filter : filter });
		}
	}
	
	handleMouseDown(event) {
		this.container.current.onmouseup = this.handleMouseUp;
		this.container.current.onmousemove = this.handleDrag;
		this.container.current.ontouchend = this.handleMouseUp;
		this.container.current.ontouchmove = this.handleDrag;
		let selectedCrop = event.currentTarget.dataset.prop;
		if(event.type === "touchstart" && event.touches.length === 1) {
			event = event.touches[0] || event.changedTouches[0];
		}
		this.setState({ selectedCrop : selectedCrop, prevX : event.clientX, prevY : event.clientY});
	}
	
	handleDrag(event) {
		var prop = event.currentTarget.dataset.prop;
		if(event.type === "touchmove" && event.touches.length === 1) {
			event = event.touches[0] || event.changedTouches[0];
		}
		let currX = this.state.prevX - event.clientX;
		let currY = this.state.prevY - event.clientY;
		let prevX = event.clientX;
		let prevY = event.clientY;
		let crop = copyOf(this.state.crop);
		if(this.state.selectedCrop === "left") {
			crop.left = (this.image.current.offsetLeft - currX) + "px";
		}else if(this.state.selectedCrop === "top") {
			crop.top = (this.image.current.offsetTop - currY) + "px";
		}else if(this.state.selectedCrop === "right") {
			crop.right = parseFloat(this.state.crop.right) + currX + "px";
		}else if(this.state.selectedCrop === "bottom") {
			crop.bottom = parseFloat(this.state.crop.bottom) + currY + "px";
		}
		this.setState({crop : crop, currX : currX, currY : currY, prevX : prevX, prevY : prevY});
	}
	
	handleMouseUp(event) {
		this.container.current.onmouseup = null;
		this.container.current.onmousemove = null;
		this.container.current.ontouchend = null;
		this.container.current.ontouchmove = null;
		this.setState({ selectedCrop : "" });
	}
	
	render() {
		return (
			<div className="overlay">
				<button data-name="ok" className="absolute top-margin right-margin round-button" onClick={this.handleClick}>
					<div className="ok-icon"></div>
				</button>
				<button data-name="cancel" className="absolute top-margin left-margin round-button" onClick={this.handleClick}>
					<div className="cancel-icon"></div>
				</button>
				{ this.state.selectedOption === "size-config" ? 
					<div className="main-image-filter" ref={this.container}>
						<img src={this.props.data.image} alt="error" style={{filter : mergeFilterStyle(this.state.filter)}}/>
						<div className="image-crop-overlay"></div>
						<div className="image-crop-view" style={this.state.crop} ref={this.image}>
							<img src={this.props.data.image} alt="error" style={{filter : mergeFilterStyle(this.state.filter), margin : mergeCropStyle(this.state.crop)}}/>
							<div className="absolute image-horizontal-grid"></div>
							<div className="absolute image-vertical-grid"></div>
							<div data-prop="left" className="absolute image-crop-left" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}></div>
							<div data-prop="top" className="absolute image-crop-top" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}></div>
							<div data-prop="right" className="absolute image-crop-right" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}></div>
							<div data-prop="bottom" className="absolute image-crop-bottom" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}></div>
						</div>
					</div> :
					<div className="main-image-filter overflow-hidden">
						<img src={this.props.data.image} alt="error" style={{filter : mergeFilterStyle(this.state.filter), margin : mergeCropStyle(this.state.crop)}}/>
					</div>
				}
				<div className="config-background config-container">
					{ this.state.selectedOption === "filter-config" && <ImageFilterComponent image={this.props.data.image} selectedFilter={this.state.selectedFilter} value={this.state.filter[this.state.selectedFilter]} handleClick={this.handleClick} handleChange={this.handleChange} /> }
					<div className="config-menu-container">
						<div data-name="selectedOption" data-value="size-config" className={this.state.selectedOption === "size-config" ? "selected" : ""} onClick={this.handleClick}>Size</div>
						<div data-name="selectedOption" data-value="filter-config" className={this.state.selectedOption === "filter-config" ? "selected" : ""} onClick={this.handleClick}>Filter</div>
					</div>
				</div>
			</div>
		);
	}
}

class ImageFilterComponent extends React.Component {
	render() {
		let rangeConfig = IMAGE_FILTER_CONFIG[this.props.selectedFilter];
		let thumbnailConfig = Object.keys(IMAGE_FILTER_CONFIG).map((filter) => {
			return (
				<div className={filter === this.props.selectedFilter ? "image-thumbnail selected" : "image-thumbnail" } key={filter} data-name="selectedFilter" data-value={filter} onClick={this.props.handleClick}>
					<img src={this.props.image} style={IMAGE_FILTER_CONFIG[filter].style} alt="error"/>
					<div>{IMAGE_FILTER_CONFIG[filter].label}</div>
				</div>
			);
		});
		return (<>
			<RangeComponent name="filter" property={this.props.selectedFilter} label={rangeConfig.label} value={parseInt(this.props.value)} convertToPercent="true" suffix="%" min={rangeConfig.min} max={rangeConfig.max} handleChange={this.props.handleChange} />
			<div className="image-thumbnail-container"> {thumbnailConfig} </div>
		</>);
	}
}

export default App;
