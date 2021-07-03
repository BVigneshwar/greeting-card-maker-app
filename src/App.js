import React from 'react';
import html2canvas from 'html2canvas';

import {copyOf, loadImage} from './Utility.js';
import {ButtonComponent, ImageInputComponent} from './CommonComponents.js';
import BackgroundConfigComponent from './BackgroundConfigComponent.js';
import {DraggableComponent, DraggableConfigComponent} from './DraggableComponent.js';
import TextConfigComponent from './TextConfigComponent.js';
import ImageConfigComponent from './ImageConfigComponent.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			backgroundSize : "1 x 1",
			backgroundImage : "linear-gradient(to left, #673AB7, #2196F3, #4CAF50, #00BCD4, #FFEB3B, #FF9800, #FF5722)",
			backgroundColor : "#FFFFFF",
			backgroundGradient : "linear-gradient(#D1C4E9,#B2EBF2)",
			backgroundImageSize : "cover",
			backgroundStyle : "backgroundColor",
			addIconClicked : false,
			configOverlay : false,
			backgroundConfigOverlay : false,
			textArray : [],
			imageArray : [],
			selectedDraggable : undefined,
			screenshotMode : false
		};
		this.container = React.createRef();
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleTextSave = this.handleTextSave.bind(this);
		this.handleImageSave = this.handleImageSave.bind(this);
		this.handleBackgroundSave = this.handleBackgroundSave.bind(this);
		this.handleImageHeight = this.handleImageHeight.bind(this);
		this.handleScreenshot = this.handleScreenshot.bind(this);
		
		this.state.touchDiff = 0;
		this.appElem = React.createRef();
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
	}
	
	handleChange(event) {
		event.stopPropagation();
		
		if(event.target.dataset.name === "backgroundConfig") {
			this.setState({ backgroundConfigOverlay : true });
		}
		
		if(event.target.dataset.name === "backgroundSizeConfig") {
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
			this.setState({ configOverlay : true });
		}
		
		if(event.target.name === "addImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				loadImage(file, (response) => {
					let image = {
						id : "img_"+Date.now(),
						style : {
							width : "100px",
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
							top : "0%",
							left : "0%",
							width : "100%",
							height : "100%",
							offsetTop : 0,
							offsetLeft : 0,
							offsetWidth : 100,
							offsetHeight : 100
						},
						image : response
					};
					this.handleImageSave(image);
				});
			}
		}
		
		if(event.target.dataset.name === "addText") {
			this.setState({ configOverlay : true, addIconClicked : false });
		}
		
		if(event.target.dataset.name === "style") {
			this.setState({ [event.target.dataset.prop] : event.target.dataset.value });
		}
		
		if(event.target.name === "rotate") {
			if(this.state.selectedDraggable.startsWith("txt")) {
				let textArray = copyOf(this.state.textArray).map((text) => {
					if(text.id === this.state.selectedDraggable) {
						text.style.transform = "rotate(" + event.target.value + "deg)";
					}
					return text;
				});
				this.setState({ textArray : textArray });
			}else {
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
			if(this.state.selectedDraggable.startsWith("txt")) {
				let textArray = copyOf(this.state.textArray).map((text) => {
					if(text.id === this.state.selectedDraggable) {
						text.style.fontSize = event.target.value + "px";
					}
					return text;
				});
				this.setState({ textArray : textArray });
			}else {
				let imageArray = copyOf(this.state.imageArray).map((image) => {
					if(image.id === this.state.selectedDraggable) {
						image.style.height = (parseFloat(image.style.height)*event.target.value)/parseFloat(image.style.width) + "px";
						image.style.width = event.target.value + "px";
					}
					return image;
				});
				this.setState({ imageArray : imageArray });
			}
		}
		
		if(event.target.dataset.name === "delete") {
			if(this.state.selectedDraggable.startsWith("txt")) {
				let textArray = copyOf(this.state.textArray).filter((text) => {
					return text.id !== this.state.selectedDraggable;
				});
				this.setState({ textArray : textArray, selectedDraggable : undefined });
			}else {
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
			this.setState({addIconClicked : false, screenshotMode : false});
		}else {
			this.setState({addIconClicked : false, screenshotMode : false, selectedDraggable : undefined});
		}
	}
	
	handleScreenshot() {
		/* For Save purpose */
		/*html2canvas(document.querySelector(".greeting-background")).then(canvas => {
			var a = document.createElement('a'); 
			a.download = "greeting-card.png"; 
			a.href =  canvas.toDataURL();
			a.click();
		});*/
		this.setState({screenshotMode : true, selectedDraggable : undefined});
	}
	
	handleImageSave(image) {
		if(image) {
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
			this.setState({imageArray : imageArray, configOverlay : false, selectedDraggable : undefined});
		}else {
			this.setState({configOverlay : false});
		}
	}
	
	handleTextSave(text) {
		if(text && text.text) {
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
			this.setState({textArray : textArray, configOverlay : false});
		}else {
			this.setState({configOverlay : false});
		}
	}
	
	handleBackgroundSave(background) {
		if(background) {
			this.setState({
				backgroundImage : background.backgroundImage,
				backgroundColor : background.backgroundColor,
				backgroundGradient : background.backgroundGradient,
				backgroundImageSize : background.backgroundImageSize,
				backgroundStyle : background.backgroundStyle,
				backgroundConfigOverlay : false
			});
		}else {
			this.setState({backgroundConfigOverlay : false});
		}
	}
	
	handleImageHeight(id, height) {
		let imageArray = copyOf(this.state.imageArray).map((image) => {
			if(image.id === id) {
				image.style.height = height + "px";
			}
			return image;
		});
		this.setState({ imageArray : imageArray });
	}
	
	componentDidMount() {
		document.body.addEventListener("touchmove", (event) => event.preventDefault());
	}
	
	componentWillUnmount() {
		document.body.removeEventListener("touchmove", (event) => event.preventDefault());
	}
	
	handleTouchStart(event) {
		if(this.state.selectedDraggable && event.touches.length === 2) {
			let pos1 = event.touches[0].clientY;
			let pos2 = event.touches[1].clientY;
			let diff = pos1 > pos2 ? parseInt(pos1 - pos2) : parseInt(pos2 - pos1);
			this.setState({ touchDiff : diff });
			this.appElem.current.ontouchmove = this.handleTouchMove;
			this.appElem.current.ontouchend = this.handleTouchEnd;
		}
	}
	
	handleTouchMove(event) {
		if(this.state.selectedDraggable && event.touches.length === 2) {
			let pos1 = event.touches[0].clientY;
			let pos2 = event.touches[1].clientY;
			let currDiff = pos1 > pos2 ? parseInt(pos1 - pos2) : parseInt(pos2 - pos1);
			let diff = currDiff - this.state.touchDiff;
			
			if(this.state.selectedDraggable.startsWith("txt")) {
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
			}else {
				let imageArray = copyOf(this.state.imageArray).map((image) => {
					if(image.id === this.state.selectedDraggable) {
						let value = parseFloat(image.style.width) + diff/10;
						if(value < 50) {
							value = 50;
						}else if(value > this.container.current.offsetWidth) {
							value = this.container.current.offsetWidth;
						}
						image.style.height = (parseFloat(image.style.height)*value)/parseFloat(image.style.width) + "px";
						image.style.width = value + "px";
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
		}else {
			width = ((width * 100)/height) + "vmin";
			height = "100vmin";
		}
		
		let backgroundStyle = {
			width : width,
			height : height,
			backgroundImage : this.state.backgroundStyle === "backgroundColor" ? "" : (this.state.backgroundStyle === "backgroundGradient" ? this.state.backgroundGradient : this.state.backgroundImage),
			backgroundColor : this.state.backgroundColor,
			backgroundSize : this.state.backgroundImageSize,
			backgroundRepeat : "no-repeat",
			backgroundPosition : "center"
		}
		
		let textElements = this.state.textArray.map((data) => <DraggableComponent key={data.id} id={data.id} selected={data.id === this.state.selectedDraggable} container={this.container} handleDraggableClick={(id) => this.setState({ selectedDraggable : id })} style={data.style} fontColorStyle={data.fontColorStyle} fontGradientColor={data.fontGradientColor} fontImage={data.fontImage} backgroundColorStyle={data.backgroundColorStyle} backgroundGradientColor={data.backgroundGradientColor} backgroundImage={data.backgroundImage} text={data.text} /> );
		let imageElements = this.state.imageArray.map((data) => <DraggableComponent key={data.id} id={data.id} selected={data.id === this.state.selectedDraggable} container={this.container} handleDraggableClick={(id) => this.setState({ selectedDraggable : id })} style={data.style} filter={data.filter} crop={data.crop} image={data.image} handleImageHeight={this.handleImageHeight}/> );
		
		let selectedDraggable;
		if(this.state.selectedDraggable) {
			if(this.state.selectedDraggable.startsWith("txt")) {
				selectedDraggable = this.state.textArray.find((text) => text.id === this.state.selectedDraggable );
			}else {
				selectedDraggable = this.state.imageArray.find((image) => image.id === this.state.selectedDraggable );
			}
		}
		
		return (
			<div className={this.state.screenshotMode ? "screenshot-mode" : ""} ref={this.appElem} onTouchStart={this.handleTouchStart}>
				<ButtonComponent name="backgroundConfig" className="absolute top-margin left-margin round-button" onClick={this.handleChange} iconClass="add-background-icon"/>
				<div className="absolute background-size top-margin pointer" data-name="backgroundSizeConfig" onClick={this.handleChange} data-value={this.state.backgroundSize}>{this.state.backgroundSize}</div>
				<ButtonComponent name="screenshot" className="absolute top-margin right-margin round-button" onClick={this.handleScreenshot} iconClass="screenshot-icon"/>
				
				{ !this.state.backgroundConfigOverlay && !this.state.configOverlay && this.state.selectedDraggable && <ButtonComponent name="delete" className="absolute right-margin round-button" style={{top:"60px"}} onClick={this.handleChange} iconClass="delete-icon"/> }
				
				{ !this.state.backgroundConfigOverlay && !this.state.configOverlay && <ButtonComponent name={this.state.selectedDraggable ? "edit" : "add"} className="absolute bottom-margin right-margin round-button" onClick={this.handleChange} iconClass={this.state.selectedDraggable ? "edit-icon" : "add-icon"} /> }
				
				{ this.state.addIconClicked && <>
					<ImageInputComponent id="addImage" name="addImage" onChange={this.handleChange} className="absolute right-margin round-button" style={{bottom:"110px"}} iconClass="add-image-icon" />
					<ButtonComponent name="addText" className="absolute right-margin round-button" style={{bottom:"60px"}} onClick={this.handleChange} iconClass="add-text-icon"/>
				</> }
				
				<div className="greeting-container" onClick={this.handleClick}>
					<div className="greeting-background" style={backgroundStyle} ref={this.container}>
						{imageElements}
						{textElements}
					</div>
				</div>
				
				{ this.state.configOverlay && ((this.state.selectedDraggable && this.state.selectedDraggable.startsWith("img")) ? <ImageConfigComponent data={selectedDraggable} onSave={this.handleImageSave} /> : <TextConfigComponent data={selectedDraggable} onSave={this.handleTextSave}/>) }
				{ this.state.backgroundConfigOverlay && <BackgroundConfigComponent backgroundColor={this.state.backgroundColor} backgroundImage={this.state.backgroundImage} backgroundImageSize={this.state.backgroundImageSize} backgroundGradient={this.state.backgroundGradient} backgroundStyle={this.state.backgroundStyle} backgroundSize={this.state.backgroundSize} handleBackgroundSave={this.handleBackgroundSave} /> }
				{ !this.state.backgroundConfigOverlay && !this.state.configOverlay && this.state.selectedDraggable && <DraggableConfigComponent rotate={selectedDraggable.style.transform} size={selectedDraggable.style.fontSize ? selectedDraggable.style.fontSize : selectedDraggable.style.width} maxSize={selectedDraggable.style.fontSize ? "50" : this.container.current.offsetWidth} minSize={selectedDraggable.style.fontSize ? "1" : "50"} handleChange={this.handleChange} /> }
			</div>
		);
	}
}

export default App;