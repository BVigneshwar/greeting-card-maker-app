import React from 'react';

import {loadImage} from './Utility.js';
import {ColorPicker} from './PickerComponents.js';
import {ButtonComponent, ImageInputComponent, BottomMenuOptionComponent} from './CommonComponents.js';

class BackgroundConfigComponent extends React.Component {
	static menu_options = [
		{label : "Color", value : "backgroundColor"},
		{label : "Gradient", value : "backgroundGradient"},
		{label : "Image", value : "backgroundImage"}
	];
	
	constructor(props) {
		super(props);
		this.state = {};
		Object.assign(this.state, this.props);
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleClick(event) {
		if(event.currentTarget.dataset.name === "backgroundStyle") {
			this.setState({backgroundStyle : event.currentTarget.dataset.value});
		}else if(event.currentTarget.dataset.name === "ok") {
			this.props.handleBackgroundSave(this.state);
		}else if(event.currentTarget.dataset.name === "cancel") {
			this.props.handleBackgroundSave();
		}
	}
	
	handleChange(event) {
		if(event.currentTarget.name === "backgroundImage") {
			if(event.target.files.length > 0){
				let file = event.target.files[0];
				loadImage(file, (response) => { this.setState({backgroundImage : "url("+response+")"}) });
			}
		}else if(event.currentTarget.dataset.prop === "backgroundColor") {
			this.setState({backgroundColor : event.currentTarget.dataset.value});
		}else if(event.currentTarget.dataset.prop === "backgroundGradientTop" || event.currentTarget.dataset.prop === "backgroundGradientBottom") {
			let gradient = this.state.backgroundGradient.replace("linear-gradient(", "").replace(")", "").split(",");
			gradient[event.currentTarget.dataset.prop === "backgroundGradientTop" ? 0 : 1] = event.currentTarget.dataset.value;
			this.setState({backgroundGradient : "linear-gradient("+gradient[0]+","+gradient[1]+")"});
		}else if(event.currentTarget.dataset.prop === "backgroundImageSize") {
			this.setState({backgroundImageSize : event.currentTarget.dataset.value});
		}
	}
	
	render() {
		var [width, height] = this.props.backgroundSize.split(" x ");
		if(document.body.offsetWidth < document.body.offsetHeight) {
			height = ((height * 50)/width) + "vmin";
			width = "50vmin";
		} else {
			width = ((width * 50)/height) + "vmin";
			height = "50vmin";
		}
		let backgroundStyle = {
			width : width,
			height : height,
			backgroundSize : this.state.backgroundImageSize,
			backgroundColor : this.state.backgroundColor,
			backgroundPosition : "center",
			backgroundRepeat : "no-repeat",
			backgroundImage : this.state.backgroundStyle === "backgroundColor" ? "" : (this.state.backgroundStyle === "backgroundGradient" ? this.state.backgroundGradient : this.state.backgroundImage)
		};
		
		let menu_config;
		if(this.state.backgroundStyle === "backgroundColor") {
			menu_config = <ColorPicker color={this.state.backgroundColor} property="backgroundColor" handleChange={this.handleChange} />;
		}else if(this.state.backgroundStyle === "backgroundGradient") {
			menu_config = (
				<>
				<ColorPicker color={this.state.backgroundGradient.replace("linear-gradient(", "").replace(")", "").split(",")[0]} property="backgroundGradientTop" handleChange={this.handleChange} />
				<ColorPicker color={this.state.backgroundGradient.replace("linear-gradient(", "").replace(")", "").split(",")[1]} property="backgroundGradientBottom" handleChange={this.handleChange} />
				</>
			);
		}else if(this.state.backgroundStyle === "backgroundImage") {
			menu_config = (
				<>
				<div>
					<ImageInputComponent id="color-style-image" name="backgroundImage" onChange={this.handleChange} className="font-image pointer" style={{bottom:"110px"}} iconClass="image-button" iconStyle={{backgroundImage : this.state.backgroundImage}}>
						<div className="edit-icon"></div>
					</ImageInputComponent>
				</div>
				<div>
					<div data-prop="backgroundImageSize" data-value="cover" className={this.state.backgroundImageSize === "cover" ? "color-style-button selected" : "color-style-button"} onClick={this.handleChange}>Cover</div>
					<div data-prop="backgroundImageSize" data-value="contain" className={this.state.backgroundImageSize === "contain" ? "color-style-button selected" : "color-style-button"} onClick={this.handleChange}>Contain</div>
				</div>
				</>
			);
		}
		
		return (
			<div className="overlay" onClick={this.handleClick}>
				<ButtonComponent name="ok" className="absolute top-margin right-margin round-button" onClick={this.handleClick} iconClass="ok-icon"/>
				<ButtonComponent name="cancel" className="absolute top-margin left-margin round-button" onClick={this.handleClick} iconClass="cancel-icon"/>
				
				<div className="screen-center" style={{top : "calc(50% - 90px)"}}>
					<div style={backgroundStyle}></div>
				</div>
				
				<div className="config-background config-container">
					{menu_config}
					<BottomMenuOptionComponent name="backgroundStyle" options={BackgroundConfigComponent.menu_options} selected={this.state.backgroundStyle} onClick={this.handleClick}/>
				</div>
			</div>
		);
	}
}

export default BackgroundConfigComponent;