function mod(z) {
	result = (z[0] ** 2 + z[1] ** 2) ** 0.5;
	return result;
}

function calculate_R(c) {
	let R = (1 + (1 + 4 * mod(c)) ** 0.5) / 2;
	return R;
}

function add(a, b) {
	let result = [a[0] + b[0], a[1] + b[1]];
	return result;
}

function square(z) {
	let result = [z[0] ** 2 - z[1] ** 2, 2 * z[0] * z[1]];
	return result;
}

function isInSet(z, c, maxIter) {
	let iter = 0;
	let new_z = z;
	let flag = true;

	while (iter < maxIter) {
		if (mod(new_z) > R) {
			flag = false;
			if (iter == 0) {
				return 1;
			}
			break;
		}

		new_z = add(square(new_z), c);
		iter++;
	}

	if (flag) {
		return 0;
	} else {
		return iter;
	}
}

const cnv = document.getElementById('cnv');
const ctx = cnv.getContext("2d");
const width = cnv.width = 1500;
const height = cnv.height = 700;
const img = ctx.createImageData(width, height);
const imgData = img.data;

const maxIter = 80;
const c = [-0.0085, 0.71];
let R = calculate_R(c);
let colors = [];
let fractalColors = [[85, 0, 0], [255, 0, 0], [255, 74, 0], [255, 189, 0], [255, 255, 136], [51, 255, 238], [0, 139, 255], [0, 31, 255], [0, 0, 255], [0, 0, 0]].reverse();
 
for (let i = 0; i < 50; i++) {
	let color = Math.floor(i * 255 / 50);
	colors.push([color, color, color]);
}

drawJuliaSet(1000, c, fractalColors, maxIter);

let x = 0;
let y = 0;
let scale = 50;
//window.requestAnimationFrame(update);

function update() {
	ctx.clearRect(0, 0, width, height);

	R = calculate_R([Math.sin(x), Math.sin(y)]);
	drawJuliaSet(150, [Math.sin(x), Math.sin(y)], fractalColors, maxIter);
	//drawJuliaSet(scale, c, colors, maxIter);

	x += 0.02;
	y += 0.03;
	scale++;
	window.requestAnimationFrame(update);
}

function drawJuliaSet(scale, constant, colors, maxIter) {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			dataIndex = (i + j * width) * 4;
			let Re = i - width / 2;
			let Im = j - height / 2;
			let z = [Re / scale, Im / scale];
			let c = constant;
			
			let color = colors[Math.ceil(isInSet(z, c, maxIter) / maxIter * (9))];
			
			for (let k = 0; k < 3; k++) {
				imgData[dataIndex + k] = color[k];
			}

			imgData[dataIndex + 3] = 255;
		}
	}

	ctx.putImageData(img, 0, 0);
}
