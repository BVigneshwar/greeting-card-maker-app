import React from 'react';

import {rescale, mergeFilterStyle} from './Utility.js';
import {RangePicker} from './PickerComponents.js';

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
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		return {
			top : this.elem.current.offsetTop - this.state.currY,
			left : this.elem.current.offsetLeft - this.state.currX,
			width : this.elem.current.offsetWidth,
			height : this.elem.current.offsetHeight,
			containerWidth : this.props.container.current.offsetWidth,
			containerHeight : this.props.container.current.offsetHeight
		};
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
		if(this.props.image) {
			
			let image_size_style = {
				top : rescale(this.props.crop.offsetTop, parseFloat(this.props.crop.top), parseFloat(this.props.style.height)) + "px",
				left : rescale(this.props.crop.offsetLeft, parseFloat(this.props.crop.left), parseFloat(this.props.style.width)) + "px",
				width : rescale(this.props.crop.offsetWidth, parseFloat(this.props.crop.width), parseFloat(this.props.style.width)) + "px",
				height : rescale(this.props.crop.offsetHeight, parseFloat(this.props.crop.height), parseFloat(this.props.style.height)) + "px"
			}
			elem = (<>
				{ this.props.selected && 
					<>
						<div ref={this.leftLineElem} className="left-dotted-line"></div>
						<div ref={this.topLineElem} className="top-dotted-line"></div>	
						<div ref={this.rightLineElem} className="right-dotted-line"></div>
						<div ref={this.bottomLineElem} className="bottom-dotted-line"></div>
					</>
				}
				<div id={this.props.id} style={{ transform : this.props.style.transform }} className={this.props.selected ? "draggable-selected absolute draggable" : "absolute draggable"} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} ref={this.elem}>
					<div className="draggable overflow-hidden" style={image_size_style}>
						<img className="draggable" style={{ filter : mergeFilterStyle(this.props.filter), width : this.props.style.width, marginTop : "-"+image_size_style.top, marginLeft : "-"+image_size_style.left }} src={this.props.image} onLoad={(event) => this.props.handleImageHeight(this.props.id, event.currentTarget.offsetHeight)} alt="error"/>
					</div>
					<div className="draggable selected-overlay"></div>
				</div>
			</>);
		
		}else if(this.props.text) {
			
			let {fontSize, transform, backgroundColor, borderColor, borderWidth, borderStyle, borderRadius, textShadow, opacity, ...style} = this.props.style;
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
			elem = ( <>
				{ this.props.selected && 
					<>
						<div ref={this.leftLineElem} className="left-dotted-line"></div>
						<div ref={this.topLineElem} className="top-dotted-line"></div>	
						<div ref={this.rightLineElem} className="right-dotted-line"></div>
						<div ref={this.bottomLineElem} className="bottom-dotted-line"></div>
					</>
				}
				<div id={this.props.id} style={{fontSize, transform}} className={this.props.selected ? "draggable-selected absolute draggable" : "absolute draggable"} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} ref={this.elem}>
					<div style={style} className={this.props.fontColorStyle !== "normal" ? "background-font draggable" : "draggable"}>
						<div className="text-background" style={backgroundStyle}></div>
						<div style={{textShadow : textShadow, padding : style.padding}} className="text-shadow">{this.props.text}</div>
						<div className="draggable">{this.props.text}</div>
						<div className="draggable selected-overlay"></div>
					</div>
				</div>
			</> );
			
		}
		return elem;
	}
}

class DraggableConfigComponent extends React.Component {
	render() {
		return (
			<div className="config-container" style={{right : "80px"}}>
				<div className="draggable-config-container">
					<RangePicker name="size" label="Size" value={this.props.size.replace("px", "")} convertToPercent="true" suffix="%" min={this.props.minSize} max={this.props.maxSize} step={this.props.step} handleChange={this.props.handleChange} />
					<RangePicker name="rotate" label="Rotate" value={this.props.rotate.replace("rotate(", "").replace("deg)", "")} suffix="deg" min="-180" max="180" step="5" handleChange={this.props.handleChange} />
				</div>
			</div>
		);
	}
}


export {DraggableComponent, DraggableConfigComponent};