(function(){
    if( ! document.baseURI.includes('dataURL') ){
		var base_url = window.location.href;
		var exampleLink = base_url + "?dataURL=vcf_specification.vcf";
		//var exampleLink = base_url + "?dataURL=valid-4.1.vcf";
		var a = document.createElement("a");
		a.href = exampleLink;
		a.className = "btn btn-default btn-file";
		a.innerText = "Load Demo";
		document.getElementById("demo").appendChild( a );
		// list more examples
		var div = document.getElementById("demo")
		demo.style.textAlign="left"
		var h = '<h3>Ejemplos</h3>'
		h +='<p style="color:green">(Click sobre <span style="background-color:yellow">lo resaltado</span> para descargar este archivo de muestra, puede seleccionar uno nuevo archivo.)<p>'
		div.innerHTML=h
		var exs = [
			'vcf_specification.vcf',
			'AGGCAGAATATCCTCT.vcf',
		]
		var ol = document.createElement('ol')
		ol.style.color="maroon"
		exs.forEach(function(ex){
			var li = document.createElement('li')
			var nm = ex
			if(ex.match('/')){
				nm = ex.match(/\/[^\/]+\.vcf/)[0].slice(1)
			}
			var h = '<a href="'+location.href+'?dataURL='+ex+'" target="_blank" style="background-color:yellow">'+nm+'</a> (<a href="view.html?'+ex+'" target="_blank" style="color:blue">View VCF</a>)'
			li.innerHTML=h
			ol.appendChild(li) 
		})
		div.appendChild(ol)
	}
	// UPLOAD CLASS DEFINITION
	// ======================
	var dropZone = document.getElementById('drop-zone');
	dropZone.ondragover = function() {
		this.className = 'upload-drop-zone drop';
		return false;
	}
	dropZone.ondragleave = function() {
		this.className = 'upload-drop-zone';
		return false;
	}
	$(document).on('change', '.btn-file :file', function() {
		var input = $(this),
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
	});
})();

function save() {
	var options = {
		fileName: "Export xlsx Sipmle Sheet"
	};
	Jhxlsx.export(tableData, options);
}

populatePanelsWithReaderResult = function(rr, name) {
	name = name || "vcf2xls";
	
	vcf = parse_vcf(rr);
    vcf2jsonLd(vcf, function(a){vcfJsonLd = a});
    vcf2rdf(rr, function(res){
		var ws = XLSX.utils.json_to_sheet(vcfJsonLd);
		/* add to workbook */
		var wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
		var wbout = XLSX.writeFile(wb, name+".xlsx");
		var blobXLS = URL.createObjectURL(new Blob([wbout], {type: 'application/octet-stream'}));

		b = document.createElement("a");
		//b.href = blobJSON;
		b.href = blobXLS;
		b.className = "btn btn-success btn-xs btn-file col-md-offset-4 col-md-4";
		b.download = name+".xlsx";
		b.innerText = 'Guardar Excel';
		b.setAttribute("style", "padding:2px");


		document.getElementById("file-buttons").appendChild( b );
		myObj = JSON.parse( JSON.stringify(vcfJsonLd) );
		txt=""
		txt += "<table class='table table-striped table-hover table-condensed'>"
		colnames= ["CHROM", "POS", "ID", "REF", "ALT", "QUAL", "FILTER", "INFO", "FORMAT"]
		txt += "<tr>";
		for ( let key of colnames ) {
		  txt +="<th class='text-center'>" + key + "</th>";
		}
		txt += "</tr>";
		for (x = 0; x < 5; x++) {
			txt += "<tr>";
			for ( let key of colnames  ) {
				//console.log(myObj[x])
				txt +="<td>" + myObj[x][key] + "</td>";
			}
			txt += "</tr>";
		}
		txt += "</table>" 

		jsonDisplayArea.innerHTML = txt; //innerJson.split('\n', 5).join("\n")+ "\n... Estas son las primeras 5 lineas";
    })
}

window.onload = function() {

    // Test if url has ?something
    if(document.baseURI.includes('dataURL')){
    var fileToGet = document.baseURI.split("?dataURL=")[1];
    
	
	$.get(fileToGet)
	    .then(function(a){
		//console.log(a.slice(0,5000));
		vcf2rdf(a, function(b){
		    vcfJsonLd = b;
		    populatePanelsWithReaderResult(a)});

	    })
	    .fail(function(){
	    		
	    	var a = document.createElement("div");
	    	a.className="alert alert-danger";
	    	a.innerText = "Failed to get file.\n\nPlease provide a url like the one below:\n\n" + location.pathname + "?dataURL=<link a vcf file>";
	    	document.getElementById("demo").appendChild(a);
		});
    }

    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(e) {
		var files = fileInput.files;
		for (var i = 0; i < files.length; i++) {
			if (files[i].type.match( /text.*/ )) {
				var reader = new FileReader();
				reader.fileName = files[i].name;
				reader.onload = function () {
					populatePanelsWithReaderResult(reader.result, reader.fileName);
				}
				reader.readAsText(files[i]);
			} else {
				jsonDisplayArea.innerText = "Only VCF version 4.2 is supported" 
			}
		}
	});
	var dropZone = document.getElementById('drop-zone');

	dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
		var files = e.dataTransfer.files[0];
		for (var i = 0; i < files.length; i++) {
			if (files[i].type.match( /text.*/ )) {
				var reader = new FileReader();
				reader.fileName = files[i].name;
				reader.onload = function () {
					populatePanelsWithReaderResult(reader.result, reader.fileName);
				}
				reader.readAsText(files[i]);
			} else {
				jsonDisplayArea.innerText = "Only VCF version 4.2 is supported" 
			}
		}
	});
}
