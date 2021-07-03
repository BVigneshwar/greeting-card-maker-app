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

function rescale(ref_actual_size, ref_percent, size) {
	let ref_size = ref_actual_size * 100 / ref_percent;
	return ref_actual_size * size / ref_size;
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

export {copyOf, loadImage, rescale, mergeFilterStyle};