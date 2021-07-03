import React from 'react';
import noColorIcon from './icons/no-color-icon.png';

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
	constructor(props) {
		super(props);
		this.state = {
			leftClass : "left-scroll-button",
			rightClass : "right-scroll-button highlight"
		};
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
		var fontElements = FONT.map((font, index) => {
			return <div key={index} data-name="style" data-prop="fontFamily" data-value={font} className={this.props.fontFamily === font ? "font-button selected" : "font-button"} style={{fontFamily : font}} onClick={this.props.handleChange}>Aa</div>;
		});
		return (
			<div className="color-picker-wrapper">
				<div data-name="scroll-left" className={this.state.leftClass} onClick={this.handleClick}></div>
				<div className="font-picker-container" onScroll={this.handleScroll} ref={this.container}>
					{fontElements}
				</div>
				<div data-name="scroll-right" className={this.state.rightClass} onClick={this.handleClick}></div>
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
					<div className="color-button" style={this.props.normal.color === "transparent" ? {backgroundImage : "url("+noColorIcon+")"} : {backgroundColor : this.props.normal.color}}></div>
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

class RangePicker extends React.Component {
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

export {TextAlignPicker, FontPicker, ColorStylePicker, ColorPicker, FontStylePicker, BorderStylePicker, RangePicker};