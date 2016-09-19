function draw (e) {

		var canvas = document.getElementById('canvas'),
				ctx = canvas.getContext('2d'),
				columnPadding = 25,
				selectedFile = e.target.files[0];

    loadImage.parseMetaData(
    selectedFile,
    function (data) {
    		var exifOrientation;
    		var divWidth;

    		if (data.exif) {
    			exifOrientation = data.exif.get('Orientation');
    		} else {
    			exifOrientation = 0;
    		}

        loadImage(
        	selectedFile,
        	function (img) {
						divWidth = document.getElementById('divCanvas').clientWidth - columnPadding;
						var scaledImage = loadImage.scale(
							img,
							{maxWidth: divWidth}
							);
        		canvas.style.width = scaledImage.width;
        		canvas.style.height = scaledImage.height;
        		canvas.height = scaledImage.height;
        		canvas.width = scaledImage.width
        		ctx.drawImage(scaledImage, 0, 0);
        	},
        	{ maxWidth: 1200, orientation: exifOrientation, canvas: true} // Options
    		);

    },
    {
        maxMetaDataSize: 262144,
        disableImageHead: false
    }
	);
};

document.getElementById("loadImage").addEventListener("change", draw, false)