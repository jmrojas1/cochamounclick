var sheetsUrlPolygons = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1mbr5C2zf4xzQ7kjS8YasY7sFkzmm5AMurZKKt3rAQHFNQ1PLRXCf867gBnFztD-ipkpj28SiaDdQ/pub?output=csv";

function addPolygons(data) {
	
	var polygonCoordinates = JSON.parse(data.geometry);

	var polygons = {
		"type": "FeatureCollection",
		"features": []
	}

	var polygonss = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 0.4,
		"fillColor": "#f2f3f7",
		"fillOpacity": 0.1,
		"pane": "PolygonsPane"
	}

	var polygonsecologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 0.4,
		"fillColor": "#f06102",
		"fillOpacity": 0.1,
		"pane": "PolygonsPane"
	}

	polygons.features.push({
		"type": "Feature",
		"geometry": {
			"type": "MultiPolygon",
			"coordinates": polygonCoordinates
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

	PolygonMarkers = L.geoJSON(polygons, {

		style: function (Feature) {
			switch (Feature.properties.Subcategoria) {
				case "Natural": return polygonss;
				case "Ecológico": return polygonsecologico;
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
	Papa.parse(sheetsUrlPolygons, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: function (polygonsResults) {
			var polygonsData = polygonsResults.data
			
			polygonsData.map((data, index) => {
				data.geometry ? addPolygons(data) : linesData.splice(index, 1)
			})
		}
	})
}

window.addEventListener('DOMContentLoaded', init)