import React from 'react';
import ContentEditable from 'react-contenteditable';

import {copyOf, loadImage} from './Utility.js';
import {TextAlignPicker, FontPicker, ColorStylePicker, ColorPicker, FontStylePicker, BorderStylePicker, RangePicker} from './PickerComponents.js';
import {ButtonComponent, BottomMenuOptionComponent} from './CommonComponents.js';

class TextConfigComponent extends React.Component {
	static menu_options = [
		{label : "Font", value : "font-config"},
		{label : "Shadow", value : "text-shadow-config"},
		{label : "Background", value : "background-config"},
		{label : "Border", value : "border-config"}
	];
	
	constructor(props) {
		super(props);
		this.state = {
			id : "txt_"+Date.now(),
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
				opacity : 1,
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
			}else if(event.currentTarget.dataset.prop === "opacity"){
				style[event.currentTarget.dataset.prop] = event.currentTarget.value;
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
		
		let backgroundGradient = this.state.backgroundGradientColor.replace("linear-gradient(", "").replace(")", "").split(",");
		let fontGradient = this.state.fontGradientColor.replace("linear-gradient(", "").replace(")", "").split(",");
		let [textShadowLeft, textShadowTop, textShadowBlur, textShadowColor] = this.state.style.textShadow.split(" ");
		
		let menu_config;
		if(this.state.selectedOption === "font-config") {
			menu_config = (
				<div>
					<TextAlignPicker textAlign={this.state.style.textAlign} handleChange={this.handleChange} />
					<FontPicker fontFamily={this.state.style.fontFamily} handleChange={this.handleChange} />
					<ColorStylePicker colorStyle={this.state.fontColorStyle} selectedGradient={this.state.selectedFontGradient} styleProperty="fontColorStyle" normal={{color : this.state.style.color, property : "color"}} gradient={{property : "selectedFontGradient", top : fontGradient[0], bottom : fontGradient[1], selectedGradient : this.state.selectedFontGradient, topProperty : "fontGradientTop", bottomProperty : "fontGradientBottom"}} image={{property : "fontImage", value : this.state.fontImage}} handleClick={this.handleClick} handleChange={this.handleChange}/>
					<FontStylePicker fontStyle={this.state.style.fontStyle} fontWeight={this.state.style.fontWeight} textDecoration={this.state.style.textDecoration} handleChange={this.handleChange} />
				</div>
			);
		}else if(this.state.selectedOption === "text-shadow-config") {
			menu_config = (
				<div>
					<ColorPicker color={textShadowColor} transparent="true" property="textShadowColor" handleChange={this.handleChange} />
					<RangePicker name="style" property="textShadowLeft" label="Left" value={textShadowLeft.replace("px", "")} suffix="px" min="-20" max="20" handleChange={this.handleChange} />
					<RangePicker name="style" property="textShadowTop" label="Top" value={textShadowTop.replace("px", "")} suffix="px" min="-20" max="20" handleChange={this.handleChange} />
					<RangePicker name="style" property="textShadowBlur" label="Blur" value={textShadowBlur.replace("px", "")} suffix="%" min="0" max="20" handleChange={this.handleChange} />
				</div>
			);
		}else if(this.state.selectedOption === "background-config") {
			menu_config = (
				<div>
					<ColorStylePicker colorStyle={this.state.backgroundColorStyle} selectedGradient={this.state.selectedBackgroundGradient} styleProperty="backgroundColorStyle" normal={{color : this.state.style.backgroundColor, property : "backgroundColor", transparent : true}} gradient={{property : "selectedBackgroundGradient", top : backgroundGradient[0], bottom : backgroundGradient[1], selectedGradient : this.state.selectedBackgroundGradient, topProperty : "backgroundGradientTop", bottomProperty : "backgroundGradientBottom"}} image={{property : "backgroundImage", value : this.state.backgroundImage}} handleClick={this.handleClick} handleChange={this.handleChange}/>
					<RangePicker name="style" property="padding" label="Size" value={this.state.style.padding.replace("px", "")} suffix="px" min="0" max="50" handleChange={this.handleChange} />
					<RangePicker name="style" property="opacity" label="Opacity" value={this.state.style.opacity} suffix="%" convertToPercent="true" min="0" max="1" step="0.1" handleChange={this.handleChange} />
				</div>
			);
		}else if(this.state.selectedOption === "border-config") {
			menu_config = (
				<div>
					<ColorPicker color={this.state.style.borderColor} property="borderColor" transparent="true" handleChange={this.handleChange} />
					<BorderStylePicker borderStyle={this.state.style.borderStyle} handleChange={this.handleChange}/>
					<RangePicker name="style" property="borderWidth" label="Size" value={this.state.style.borderWidth.replace("px", "")} suffix="px" min="0" max="10" handleChange={this.handleChange} />
					<RangePicker name="style" property="borderRadius" label="Radius" value={this.state.style.borderRadius.replace("px", "")} suffix="px" min="0" max="100" handleChange={this.handleChange} />
				</div>
			);
		}
		
		return (
			<div className="overlay" onClick={this.handleClick}>
				<ButtonComponent name="ok" className="absolute top-margin right-margin round-button" onClick={this.handleClick} iconClass="ok-icon"/>
				<ButtonComponent name="cancel" className="absolute top-margin left-margin round-button" onClick={this.handleClick} iconClass="cancel-icon"/>
				<div className="screen-center" spellCheck="false">
					<InputTextComponent style={this.state.style} selectedOption={this.state.selectedOption} text={this.state.text} handleTextChange={this.handleTextChange} {...colorStyleProps}/>
				</div>
				<div className={this.state.selectedOption !== "" ? "config-background config-container" : "config-container"} onClick={(e) => e.stopPropagation()}>
					{ menu_config }
					<BottomMenuOptionComponent name="selectedOption" options={TextConfigComponent.menu_options} selected={this.state.selectedOption} onClick={this.handleClick}/>
				</div>
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
		let {backgroundColor, borderColor, borderWidth, borderStyle, borderRadius, textShadow, opacity, ...style} = this.props.style;
		
		if(this.props.fontColorStyle === "gradient") {
			style.backgroundImage = this.props.fontGradientColor;
		}else if(this.props.fontColorStyle === "image") {
			style.backgroundImage = this.props.fontImage;
		}
		let backgroundStyle = {backgroundColor, borderColor, borderWidth, borderStyle, borderRadius, opacity};
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

export default TextConfigComponent;