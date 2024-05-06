function normalizeSVGPaths(inputSVGPath, outputSVGPath) {
    const fs = require('fs');
    const parse = require('parse-svg-path');
    const abs = require('abs-svg-path');
    const normalize = require('normalize-svg-path');
    const { JSDOM } = require('jsdom');
    const svgContent = fs.readFileSync(inputSVGPath, 'utf8');
    const { document } = new JSDOM(svgContent, { pretendToBeVisual: true }).window;
    const svgElement = document.querySelector('svg');
    const paths = svgElement.querySelectorAll('path');

    paths.forEach((path, index) => {
        const d = path.getAttribute('d');
        console.log(`Shape ${index + 1}: ${d}`);

        // Normalize the path
        const normalizedPathArray = normalize(abs(parse(d)));
        
        // Convert the normalized path array to string without commas
        const normalizedPathString = normalizedPathArray.map(segment => segment.join(' ')).join(' ');

        console.log(`Normalized path: ${normalizedPathString}`);

        // Set the new d attribute value in the given svg file
        path.setAttribute('d', normalizedPathString);
        console.log(`Modified shape ${index + 1}: ${path.outerHTML}`);
    });

    const modifiedSVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>${svgElement.outerHTML}`;
    fs.writeFileSync(outputSVGPath, modifiedSVG, 'utf8');
    console.log('Modified SVG saved successfully.');
}

function convertSVGToPath(svgFilePath, outputFilePath) {
    const fs = require('fs');
    const { JSDOM } = require('jsdom');
    const SVGPathCommander = require('svg-path-commander');
    const svgContent = fs.readFileSync(svgFilePath, 'utf8');
    const { document } = new JSDOM(svgContent, { pretendToBeVisual: true }).window;
    const svgElement = document.querySelector('svg');

    // child shapes/tags
    const shapes = Array.from(svgElement.childNodes);
    shapes.forEach((shape, index) => {
        if (
        shape.nodeName === 'rect' ||
        shape.nodeName === 'line' ||
        shape.nodeName === 'circle' ||
        shape.nodeName === 'polygon' ||
        shape.nodeName === 'ellipse' ||
        shape.nodeName === 'polyline'
        ) {
        SVGPathCommander.shapeToPath(shape, true, document);
        // console.log(`Shape ${index + 1}: ${shape.outerHTML}`);
        }
    });

    const modifiedSVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?> ${svgElement.outerHTML}`;
    fs.writeFileSync(outputFilePath, modifiedSVG, 'utf8');
    console.log('Modified SVG saved to modified.svg');
}

const fs = require('fs');

function processFolder(inputFolder, outputFolder, processFile, processError) {
  // Read the contents of the input folder
  fs.readdir(inputFolder, (err, files) => {
    // Loop through each file
    files.forEach(fileName => {
      const inputFilePath = `${inputFolder}/${fileName}`;
      const outputFilePath = `${outputFolder}/${fileName}`;

      convertSVGToPath(inputFilePath, outputFilePath);
      normalizeSVGPaths(outputFilePath, outputFilePath);
        
    });
  });
}


processFolder('D:/PES/Internship-CDSAML/Data/Numbers Data/one-100 SVG files', 'D:/PES/Internship-CDSAML/Data/Numbers Data/Modified one-100 SVG files')
