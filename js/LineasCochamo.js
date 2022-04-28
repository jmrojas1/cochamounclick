var sheetsUrlLineas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLWzuUgy4niR5WlxCO0uEVkTaBNpnxWXCiYZrhho83CxXp9-JTpQI-gWUHgckNr7zuIHTuypdAj6GR/pub?gid=0&single=true&output=csv"

function addLines(data) {

	var lineCoordinates = JSON.parse(data.geometry);

	var lines = {
		"type": "FeatureCollection",
		"features": []
	}

	var LinesGeologico = {
		"color": "#ff0000",
		"dashArray": "10",
		"weight": 4,
		"opacity": 0.9,
		"pane": "LinesPane"
	}

	var LinesEcologico = {
		"color": "#79e83d",
		"dashArray": "10",
		"weight": 4,
		"opacity": 0.9,
		"pane": "LinesPane"
	}
	
	var LinesBiologico = {
		"color": "#f3bb3b",
		"dashArray": "10",
		"weight": 4,
		"opacity": 0.9,
		"pane": "LinesPane"
	}

	var LinesHidrologico = {
		"color": "#0084a8",
		"weight": 4,
		"opacity": 0.9,
		"pane": "LinesPane"
	}

	lines.features.push({
		"type": "Feature",
		"geometry": {
			"type": "MultiLineString",
			"coordinates": lineCoordinates
		},
		"properties": {
			"Elemento": data.elemento,
			"Categoria": data.categoria,
			"Subcategoria": data.subcategoria,
			"Ubicacion": data.ubicacion,
			"Descripcion": data.descripcion,
			"Significacion": data.significacion,
			"Referencias": data.referencias,
			"Registro": data.registro,
			"Foto": data.foto,
			"Hipervinculo": data.hipervinculo
		}
	});

	LineMarkers = L.geoJSON(lines, {

		style: function (Feature) {
			switch (Feature.properties.Subcategoria) {
				case "Geológico": return LinesGeologico;
				case "Ecológico": return LinesEcologico;
				case "Biológico": return LinesBiologico;
				case "Hidrológico": return LinesHidrologico;
			}
		},

		onEachFeature: function (Feature, layer) {
			layer.bindPopup("<b>" + Feature.properties.Elemento + "</b>");
			layer.on({ click: openSidebar });

			function openSidebar(e) {
				sidebar.show();
				{
					sidebar.setContent("<h3>" + "<a href=" + Feature.properties.Hipervinculo + " target=_blank>" + Feature.properties.Elemento + "</a></h3>" + "<img src = " + Feature.properties.Foto + " width=100%>" + "<p>" + Feature.properties.Descripcion + "</p>" + "<ul>" + "<li><b>Ubicaci&oacute;n:&nbsp;</b>" + Feature.properties.Ubicacion + "</li>" + "<li><b>Significaci&oacute;n cultural:&nbsp;</b>" + Feature.properties.Significacion + "</li>" + "<li><b>Referencias Bibliogr&aacute;ficas:&nbsp;</b>" + Feature.properties.Referencias + "<li><b>Registro:&nbsp;</b>" + Feature.properties.Registro + "</li>" + "</ul>")
				}
			};
		switch (Feature.properties.Subcategoria) {
			case "Geológico": return GeologicoGroup.addLayer(layer);
			case "Ecológico": return EcologicoGroup.addLayer(layer);
			case "Biológico": return BiologicoGroup.addLayer(layer);
			case "Hidrológico": return HidrologicoGroup.addLayer(layer);
			}
		}
	});
}


function init() {
	Papa.parse(sheetsUrlLineas, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: function (lineResults) {
			var linesData = lineResults.data

			linesData.map((data, index) => {
				data.geometry ? addLines(data) : linesData.splice(index, 1)
			})
		}
	})
}

window.addEventListener('DOMContentLoaded', init)
