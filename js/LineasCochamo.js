var sheetsUrlLineas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLWzuUgy4niR5WlxCO0uEVkTaBNpnxWXCiYZrhho83CxXp9-JTpQI-gWUHgckNr7zuIHTuypdAj6GR/pub?gid=0&single=true&output=csv"

function addLines(data) {

	var lineCoordinates = JSON.parse(data.geometry);

	var lines = {
		"type": "FeatureCollection",
		"features": []
	}

	var liness = {
		"color": "#f2f3f7",
		"dashArray": "10",
		"weight": 4,
		"opacity": 0.4,
		"pane": "LinesPane"
	}

	var linesecologico = {
		"color": "#f06102",
		"dashArray": "10",
		"weight": 4,
		"opacity": 0.4,
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
			"Foto": data.foto,
			"Hipervinculo": data.hipervinculo
		}
	});

	LineMarkers = L.geoJSON(lines, {

		style: function (Feature) {
			switch (Feature.properties.Subcategoria) {
				case "Natural": return liness;
				case "Ecológico": return linesecologico;
			}
		},

		onEachFeature: function (Feature, layer) {
			layer.bindPopup("<b>" + Feature.properties.Elemento + "</b>");
			layer.on({ click: openSidebar });

			function openSidebar(e) {
				sidebar.show();
				{
					sidebar.setContent("<h3>" + "<a href=" + Feature.properties.Hipervinculo + " target=_blank>" + Feature.properties.Elemento + "</a></h3>" + "<img src = " + Feature.properties.Foto + " width=100%>" + "<p>" + Feature.properties.Descripcion + "</p>" + "<ul>" + "<li><b>Ubicaci&oacute;n:&nbsp;</b>" + Feature.properties.Ubicacion + "</li>" + "<li><b>Significaci&oacute;n cultural:&nbsp;</b>" + Feature.properties.Significacion + "</li>" + "<li><b>Referencias Bibliogr&aacute;ficas:&nbsp;</b>" + Feature.properties.Referencias + "</li>" + "</ul>")
				}
			};
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