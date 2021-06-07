import React from 'react';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import ContentEditable from 'react-contenteditable';

function copyOf(obj) {
	var jsonObject = JSON.stringify(obj);
	return JSON.parse(jsonObject);
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
	}
	
	handleChange(event) {
		event.stopPropagation();
		
		if(event.target.dataset.name === "addBackground") {
			this.setState({ backgrounIconClicked : !this.state.backgrounIconClicked });
		}
		
		if(event.target.name === "addBackgroundImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				let type = file.type;
				let match= ["image/jpeg","image/png","image/jpg"];
				if(!((type === match[0]) || (type === match[1]) || (type === match[2]))){
					alert("Invalid File Extension");
				}else{
					let reader = new FileReader();
					reader.onload = (e) => { this.setState({backgroundImage : e.target.result}) };
					reader.readAsDataURL(file);
				}
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
			this.setState({ addTextOverlay : true });
		}
		
		if(event.target.name === "addImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				let type = file.type;
				let match= ["image/jpeg","image/png","image/jpg"];
				if(!((type === match[0]) || (type === match[1]) || (type === match[2]))){
					alert("Invalid File Extension");
				}else{
					let reader = new FileReader();
					reader.onload = (e) => {
						let image = {
							id : ""+Date.now(),
							style : {
								width : "100px",
								transform : "rotate(0deg)"
							},
							image : e.target.result
						};
						this.setState({imageArray : [...this.state.imageArray, image], addTextOverlay : false}) 
					};
					reader.readAsDataURL(file);
				}
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
						image.style.width = event.target.value + "px";
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
	
	handleImageSave() {
		html2canvas(document.querySelector(".greeting-background")).then(canvas => {
			var a = document.createElement('a'); 
			a.download = "greeting-card.png"; 
			a.href =  canvas.toDataURL();
			a.click();
		});
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
				textArray.push(text);
			}
			this.setState({textArray : textArray, addTextOverlay : false});
		}
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
			backgroundImage : this.state.backgroundImage ? "url("+this.state.backgroundImage+")" : "",
			backgroundColor : this.state.backgroundColor,
			backgroundSize : this.state.backgroundImageSize,
			backgroundRepeat : "no-repeat",
			backgroundPosition : "center"
		}
		
		let textElements = this.state.textArray.map((data) => <DraggableComponent key={data.id} id={data.id} container={this.container} handleDraggableClick={this.handleDraggableClick} style={data.style} text={data.text} /> );
		let imageElements = this.state.imageArray.map((data) => <DraggableComponent key={data.id} id={data.id} container={this.container} handleDraggableClick={this.handleDraggableClick} style={data.style} image={data.image} /> );
		
		let selectedDraggable;
		if(this.state.selectedDraggable) {
			selectedDraggable = this.state.textArray.find((text) => text.id === this.state.selectedDraggable );
			if(!selectedDraggable) {
				selectedDraggable = this.state.imageArray.find((image) => image.id === this.state.selectedDraggable );
			}
		}
		
		return (
			<div className="App">
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
				
				<button className="absolute top-margin right-margin round-button" onClick={this.handleImageSave}>
					<div className="save-icon"></div>
				</button>
				
				{this.state.selectedDraggable && 
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
						{textElements}
						{imageElements}
					</div>
				</div>
				
				{ this.state.addTextOverlay && <TextComponent data={selectedDraggable} onSave={this.handleTextSave}/> }
				{ this.state.backgroundColorOverlay && <BackgroundConfigComponent backgroundColor={this.state.backgroundColor} backgroundImageSize={this.state.backgroundImageSize} handleChange={this.handleChange} /> }
				{ !this.state.addTextOverlay && this.state.selectedDraggable &&  selectedDraggable && <DraggableConfigComponent rotate={selectedDraggable.style.transform} size={selectedDraggable.style.fontSize ? selectedDraggable.style.fontSize : selectedDraggable.style.width} maxSize={selectedDraggable.style.fontSize ? "50" : this.container.current.offsetWidth/2} handleChange={this.handleChange} /> }
			</div>
		);
	}
}

class BackgroundConfigComponent extends React.Component {
	render() {
		return (
			<div className="config-background config-container">
				<ColorPicker colors={[...BACKGROUND_COLOR, ...COLOR]} color={this.props.backgroundColor} property="backgroundColor" handleChange={this.props.handleChange} />
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
					<RangeComponent name="rotate" value={this.props.rotate.replace("rotate(", "").replace("deg)", "")} min="-180" max="180" handleChange={this.props.handleChange} />
					<RangeComponent name="size" value={this.props.size.replace("px", "")} min="1" max={this.props.maxSize} handleChange={this.props.handleChange} />
				</div>
			</div>
		);
	}
}

class DraggableComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			pos1 : 0,
			pos2 : 0,
			pos3 : 0,
			pos4 : 0
		};
		this.elem = React.createRef();
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}
	
	handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.container.current.onmouseup = this.handleMouseUp;
		this.props.container.current.onmousemove = this.handleDrag;
		this.props.container.current.ontouchend = this.handleMouseUp;
		this.props.container.current.ontouchmove = this.handleDrag;
		if(event.type === "touchstart") {
			event = event.touches[0] || event.changedTouches[0];
		}
		this.setState({ pos3 : event.clientX, pos4 : event.clientY});
		this.elem.current.classList.add("grabbing");
	}
	
	handleDrag(event) {
		event.preventDefault();
		event.stopPropagation();
		if(event.type === "touchmove") {
			event = event.touches[0] || event.changedTouches[0];
		}
		let pos1 = this.state.pos3 - event.clientX;
		let pos2 = this.state.pos4 - event.clientY;
		let pos3 = event.clientX;
		let pos4 = event.clientY;
		this.setState({pos1 : pos1, pos2 : pos2, pos3 : pos3, pos4 : pos4});
	}
	
	handleMouseUp(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.container.current.onmouseup = null;
		this.props.container.current.onmousemove = null;
		this.props.container.current.ontouchend = null;
		this.props.container.current.ontouchmove = null;
		this.elem.current.classList.remove("grabbing");
		this.props.handleDraggableClick(this.elem.current.id);
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		return {
			top : this.elem.current.offsetTop - this.state.pos2,
			left : this.elem.current.offsetLeft - this.state.pos1,
			width : this.elem.current.offsetWidth,
			height : this.elem.current.offsetHeight,
			containerWidth : this.props.container.current.offsetWidth,
			containerHeight : this.props.container.current.offsetHeight
		}
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if(snapshot) {
			let updateNeeded = prevProps.style.transform == this.props.style.transform && prevProps.style.width == this.props.style.width && prevProps.style.fontSize == this.props.style.fontSize;
			if(snapshot.left < 0) {
				snapshot.left = 0;
				updateNeeded = true;
			}
			if(snapshot.top < 0) {
				snapshot.top = 0;
				updateNeeded = true;
			}
			if(snapshot.left + snapshot.width > snapshot.containerWidth) {
				snapshot.left = snapshot.containerWidth - snapshot.width;
				updateNeeded = true;
			}
			if(snapshot.top + snapshot.height > snapshot.containerHeight) {
				snapshot.top = snapshot.containerHeight - snapshot.height;
				updateNeeded = true;
			}
			if(updateNeeded) {
				this.elem.current.style.top = (snapshot.top*100/snapshot.containerHeight) + "%";
				this.elem.current.style.left = (snapshot.left*100/snapshot.containerWidth) + "%";
			}
		}
	}
	
	componentDidMount() {
		this.elem.current.style.top = "calc(50% - " + (this.elem.current.offsetHeight/2) +"px )";
		this.elem.current.style.left = "calc(50% - " + (this.elem.current.offsetWidth/2) +"px )";
	}
	
	render() {
		let elem;
		
		if(this.props.image) {
			elem = <img id={this.props.id} className="absolute draggable" style={this.props.style} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} ref={this.elem} src={this.props.image} alt="error"/>;
		} else {
			elem = <div id={this.props.id} className="absolute draggable" style={this.props.style} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} ref={this.elem}>{this.props.text}</div>;
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
				textAlign : "center",
				fontFamily : "Times New Roman",
				color : "#FFFFFF",
				fontStyle : "normal",
				fontWeight : "normal",
				textDecoration : "none",
				backgroundColor : "transparent",
				padding : "0px",
				borderColor : "transparent",
				borderStyle : "solid",
				borderWidth : "2px",
				borderRadius : "0px",
				whiteSpace : "pre-wrap",
				fontSize : "20px",
				transform : "rotate(0deg)"
			},
			selectedOption : ""
		}
		if(props.data) {
			this.state = copyOf(props.data);
			this.state.style.fontSize = "20px";
			this.state.style.transform = "rotate(0deg)";
			this.state.selectedOption = "";
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}
	
	handleClick(value) {
		if(this.state.selectedOption === value) {
			this.setState({selectedOption : ""});
		} else {
			this.setState({ selectedOption : value});
		}
	}
	
	handleChange(event) {
		if(event.target.name === "style") {
			let style = copyOf(this.state.style);
			style[event.target.dataset.prop] = event.target.value + "px";
			this.setState({ style : style });
		}else if(event.target.dataset.name === "style") {
			let style = copyOf(this.state.style);
			style[event.target.dataset.prop] = event.target.dataset.value;
			this.setState({ style : style });
		}else if(event.target.dataset.name === "ok") {
			let data = copyOf(this.state);
			this.props.onSave(data);
		}else if(event.target.dataset.name === "cancel") {
			this.props.onSave();
		}
	}
	
	handleTextChange(event) {
		this.setState({ text : event.currentTarget.innerText});
	}
	
	render() {
		return (
			<div className="overlay" onClick={() => this.handleClick("")}>
				<button data-name="ok" className="absolute top-margin right-margin round-button" onClick={this.handleChange}>
					<div data-name="ok" className="ok-icon"></div>
				</button>
				<button data-name="cancel" className="absolute top-margin left-margin round-button" onClick={this.handleChange}>
					<div data-name="cancel" className="cancel-icon"></div>
				</button>
				<div className="screen-center" spellCheck="false">
					<InputTextComponent style={this.state.style} text={this.state.text} handleTextChange={this.handleTextChange}/>
				</div>
				<TextConfigComponent selectedOption={this.state.selectedOption} handleClick={this.handleClick} handleChange={this.handleChange} {...this.state.style}/>
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
		//this.textField.current.focus();
		ReactDOM.findDOMNode(this).focus();
	}
	
	componentDidUpdate() {
		//this.textField.current.focus();
		ReactDOM.findDOMNode(this).focus()
	}
	
	render() {
		//return <div className="editable" contentEditable="true" style={this.props.style} ref={this.textField} onInput={this.props.handleTextChange} />;
		return <ContentEditable className="editable" style={this.props.style} ref={this.textField} onChange={this.props.handleTextChange} html={this.props.text}/>;		
	}
}

class TextConfigComponent extends React.Component {
	render() {
		return (
			<div className={this.props.selectedOption !== "" ? "config-background config-container" : "config-container"} onClick={(e) => e.stopPropagation()}>
				{this.props.selectedOption === "font-config" && 
					<div>
						<TextAlignPicker textAlign={this.props.textAlign} handleChange={this.props.handleChange} />
						<FontPicker fontFamily={this.props.fontFamily} handleChange={this.props.handleChange} />
						<ColorPicker colors={COLOR} color={this.props.color} property="color" handleChange={this.props.handleChange} />
						<FontStylePicker fontStyle={this.props.fontStyle} fontWeight={this.props.fontWeight} textDecoration={this.props.textDecoration} handleChange={this.props.handleChange} />
					</div>
				}
				{this.props.selectedOption === "background-config" && 
					<div>
						<ColorPicker colors={BACKGROUND_COLOR} color={this.props.backgroundColor} property="backgroundColor" handleChange={this.props.handleChange} />
						<RangeComponent name="style" property="padding" value={this.props.padding.replace("px", "")} min="0" max="50" handleChange={this.props.handleChange} />
					</div>
				}
				{this.props.selectedOption === "border-config" && 
					<div>
						<ColorPicker colors={COLOR} color={this.props.borderColor} property="borderColor" handleChange={this.props.handleChange} />
						<BorderStylePicker borderStyle={this.props.borderStyle} handleChange={this.props.handleChange}/>
						<RangeComponent name="style" property="borderWidth" value={this.props.borderWidth.replace("px", "")} min="0" max="10" handleChange={this.props.handleChange} />
						<RangeComponent name="style" property="borderRadius" value={this.props.borderRadius.replace("px", "")} min="0" max="100" handleChange={this.props.handleChange} />
					</div>
				}
				<div className="config-menu-container">
					<div className={this.props.selectedOption === "font-config" ? "selected" : ""} onClick={() => {this.props.handleClick("font-config")}}>Font</div>
					<div className={this.props.selectedOption === "background-config" ? "selected" : ""} onClick={() => {this.props.handleClick("background-config")}}>Background</div>
					<div className={this.props.selectedOption === "border-config" ? "selected" : ""} onClick={(e) => {this.props.handleClick("border-config")}}>Border</div>
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

const FONT = ["Times New Roman", "Caveat", "Codystar", "Comfortaa", "Crafty Girls", "Dancing Script", "Limelight", "Lobster", "Pacifico", "Permanent Marker", "Source Code Pro"]
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

const COLOR = ["#000000", "#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673AB7",
			"#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
			"#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E"];
			
const BACKGROUND_COLOR = ["#000000", "#FFFFFF", "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9",
			"#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9",
			"#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2", "#FFCCBC", "#D7CCC8", "#F5F5F5"];
class ColorPicker extends React.Component {
	render() {
		var colorElements = this.props.colors.map((color, index) => {
			return <div key={index} data-name="style" data-prop={this.props.property} data-value={color} className={this.props.color === color ? "color-button selected" : "color-button"} style={{backgroundColor : color, borderColor : color}} onClick={this.props.handleChange}/>;
		});
		return (
			<div className="color-picker-container">
				{colorElements}
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
		return (
			<div className="range-container">
				<input type="range" name={this.props.name} data-prop={this.props.property} value={this.props.value} min={this.props.min} max={this.props.max} onChange={this.props.handleChange} />
			</div>
		);
	}
}

export default App;
