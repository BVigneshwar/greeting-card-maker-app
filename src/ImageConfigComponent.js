import React from 'react';

import {copyOf, rescale, mergeFilterStyle} from './Utility.js';
import {RangePicker} from './PickerComponents.js';

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
			prevY : 0,
			height : 100,
			width : 100
		};
		if(props.data) {
			Object.assign(this.state.filter, props.data.filter);
			Object.assign(this.state.crop, props.data.crop);
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleImageLoad = this.handleImageLoad.bind(this);
		
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
		if(event.type === "touchmove" && event.touches.length === 1) {
			event = event.touches[0] || event.changedTouches[0];
		}
		let currX = this.state.prevX - event.clientX;
		let currY = this.state.prevY - event.clientY;
		let prevX = event.clientX;
		let prevY = event.clientY;
		let crop = copyOf(this.state.crop);
		if(this.state.selectedCrop === "left") {
			crop.left = (crop.offsetLeft - currX)*100/this.container.current.offsetWidth + "%";
			crop.width = (crop.offsetWidth + currX)*100/this.container.current.offsetWidth + "%";
			crop.offsetLeft = (crop.offsetLeft - currX);
			crop.offsetWidth = (crop.offsetWidth + currX);
			/*crop.left = (this.image.current.offsetLeft - currX)*100/this.container.current.offsetWidth + "%";
			crop.width = (this.image.current.offsetWidth + currX)*100/this.container.current.offsetWidth + "%";
			crop.offsetLeft = (this.image.current.offsetLeft - currX);
			crop.offsetWidth = (this.image.current.offsetWidth + currX);*/
		}else if(this.state.selectedCrop === "top") {
			crop.top = (crop.offsetTop - currY)*100/this.container.current.offsetHeight + "%";
			crop.height = (crop.offsetHeight + currY)*100/this.container.current.offsetHeight + "%";
			crop.offsetTop = (crop.offsetTop - currY);
			crop.offsetHeight = (crop.offsetHeight + currY);
			/*crop.top = (this.image.current.offsetTop - currY)*100/this.container.current.offsetHeight + "%";
			crop.height = (this.image.current.offsetHeight + currY)*100/this.container.current.offsetHeight + "%";
			crop.offsetTop = (this.image.current.offsetTop - currY);
			crop.offsetHeight = (this.image.current.offsetHeight + currY);*/
		}else if(this.state.selectedCrop === "right") {
			crop.width = (crop.offsetWidth - currX)*100/this.container.current.offsetWidth + "%";
			crop.offsetWidth = (crop.offsetWidth - currX);
			/*crop.width = (this.image.current.offsetWidth - currX)*100/this.container.current.offsetWidth + "%";
			crop.offsetWidth = (this.image.current.offsetWidth - currX);*/
		}else if(this.state.selectedCrop === "bottom") {
			crop.height = (crop.offsetHeight - currY)*100/this.container.current.offsetHeight + "%";
			crop.offsetHeight = (crop.offsetHeight - currY);
			/*crop.height = (this.image.current.offsetHeight - currY)*100/this.container.current.offsetHeight + "%";
			crop.offsetHeight = (this.image.current.offsetHeight - currY);*/
		}else if(this.state.selectedCrop === "drag") {
			crop.left = (crop.offsetLeft - currX)*100/this.container.current.offsetWidth + "%";
			crop.top = (crop.offsetTop - currY)*100/this.container.current.offsetHeight + "%";
			crop.offsetLeft = (crop.offsetLeft - currX);
			crop.offsetTop = (crop.offsetTop - currY);
		}
		
		let out_of_range = false;
		if(crop.offsetLeft < 0) {
			out_of_range = this.state.selectedCrop !== "drag";
			crop.left = "0%";
			crop.offsetLeft = 0;
		}
		if(crop.offsetTop < 0) {
			out_of_range = this.state.selectedCrop !== "drag";
			crop.top = "0%";
			crop.offsetTop = 0;
		}
		if(crop.offsetLeft + crop.offsetWidth > this.container.current.offsetWidth) {
			if(this.state.selectedCrop === "drag") {
				crop.left = (this.container.current.offsetWidth - crop.offsetWidth)*100/this.container.current.offsetWidth + "%";
				crop.offsetLeft = this.container.current.offsetWidth - crop.offsetWidth;
			}else {
				out_of_range = true;
				crop.width = (this.container.current.offsetWidth - crop.offsetLeft)*100/this.container.current.offsetWidth + "%";
				crop.offsetWidth = this.container.current.offsetWidth - crop.offsetLeft;
			}
		}
		if(crop.offsetTop + crop.offsetHeight > this.container.current.offsetHeight) {
			if(this.state.selectedCrop === "drag") {
				crop.top = (this.container.current.offsetHeight - crop.offsetHeight)*100/this.container.current.offsetHeight + "%";
				crop.offsetTop = this.container.current.offsetHeight - crop.offsetHeight;
			}else {
				out_of_range = true;
				crop.height = (this.container.current.offsetHeight - crop.offsetTop)*100/this.container.current.offsetHeight + "%";
				crop.offsetHeight = this.container.current.offsetHeight - crop.offsetTop;
			}
		}
		this.setState({crop : crop, currX : currX, currY : currY, prevX : prevX, prevY : prevY});
		if(out_of_range){
			this.handleMouseUp();
		}
	}
	
	handleMouseUp(event) {
		this.container.current.onmouseup = null;
		this.container.current.onmousemove = null;
		this.container.current.ontouchend = null;
		this.container.current.ontouchmove = null;
		this.setState({ selectedCrop : "" });
	}
	
	handleImageLoad(event) {
		let crop = copyOf(this.state.crop);
		crop.offsetHeight = parseFloat(crop.height)/100 * event.currentTarget.offsetHeight;
		crop.offsetWidth = parseFloat(crop.width)/100 * event.currentTarget.offsetWidth;
		this.setState({ crop : crop, height : event.currentTarget.offsetHeight, width : event.currentTarget.offsetWidth });
	}
	
	render() {
		let image_size_style = {
			top : rescale(this.state.crop.offsetTop, parseFloat(this.state.crop.top), this.state.height) + "px",
			left : rescale(this.state.crop.offsetLeft, parseFloat(this.state.crop.left), this.state.width) + "px",
			width : rescale(this.state.crop.offsetWidth, parseFloat(this.state.crop.width), this.state.width) + "px",
			height : rescale(this.state.crop.offsetHeight, parseFloat(this.state.crop.height), this.state.height) + "px"
		};
		
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
							<img src={this.props.data.image} alt="error" style={{filter : mergeFilterStyle(this.state.filter), marginTop : "-"+this.state.crop.offsetTop+"px", marginLeft : "-"+this.state.crop.offsetLeft+"px"}} onLoad={this.handleImageLoad}/>
							<div className="absolute image-horizontal-grid"></div>
							<div className="absolute image-vertical-grid"></div>
							<div data-prop="left" className="absolute image-crop-left" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} />
							<div data-prop="top" className="absolute image-crop-top" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} />
							<div data-prop="right" className="absolute image-crop-right" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} />
							<div data-prop="bottom" className="absolute image-crop-bottom" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} />
							<div data-prop="drag" className="absolute image-drag" onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown} />
						</div>
					</div> :
					<div className="main-image-filter">
						<div className="overflow-hidden" style={image_size_style}>
							<img src={this.props.data.image} alt="error" style={{filter : mergeFilterStyle(this.state.filter), marginTop : "-"+this.state.crop.offsetTop+"px", marginLeft : "-"+this.state.crop.offsetLeft+"px"}} onLoad={this.handleImageLoad}/>
						</div>
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
			<RangePicker name="filter" property={this.props.selectedFilter} label={rangeConfig.label} value={parseInt(this.props.value)} convertToPercent="true" suffix="%" min={rangeConfig.min} max={rangeConfig.max} handleChange={this.props.handleChange} />
			<div className="image-thumbnail-container"> {thumbnailConfig} </div>
		</>);
	}
}

export default ImageConfigComponent;