function ButtonComponent(props) {
	return (
		<button data-name={props.name} className={props.className} onClick={props.onClick} style={props.style}>
			<div data-name={props.name} className={props.iconClass}></div>
		</button>
	);
}

function ImageInputComponent(props) {
	return (
	<>
		<input id={props.id} hidden type="file" name={props.name} accept = "image/*" onChange={props.onChange} />
		<label className={props.className} style={props.style} htmlFor={props.id}>
			<div className={props.iconClass} style={props.iconStyle}>
				{props.children}
			</div>
		</label>
	</>
	);
}

function BottomMenuOptionComponent(props) {
	return (
		<div className="config-menu-container">
			{ props.options.map((option) => <div data-name={props.name} data-value={option.value} className={props.selected === option.value ? "selected" : ""} onClick={props.onClick}>{option.label}</div> ) }
		</div>
	)
}

export {ButtonComponent, ImageInputComponent, BottomMenuOptionComponent};