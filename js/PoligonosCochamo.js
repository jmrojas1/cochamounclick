var sheetsUrlPolygons = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1mbr5C2zf4xzQ7kjS8YasY7sFkzmm5AMurZKKt3rAQHFNQ1PLRXCf867gBnFztD-ipkpj28SiaDdQ/pub?gid=0&single=true&output=csv";

function addPolygons(data) {
	
	var polygonCoordinates = JSON.parse(data.geometry);

	var polygons = {
		"type": "FeatureCollection",
		"features": []
	}

	var PolygonsGeologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#ff0000",
		"fillOpacity": 0.9,
		"pane": "PolygonsPane"
	}

	var PolygonsEcologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#79e83d",
		"fillOpacity": 0.9,
		"pane": "PolygonsPane"
	}

	var PolygonsBiologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#f3bb3b",
		"fillOpacity": 0.9,
		"pane": "PolygonsPane"
	}

	var PolygonsHidrologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#0084a8",
		"fillOpacity": 0.9,
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
			"Registro": data.registro,
			"Foto": data.foto,
			"Hipervinculo": data.hipervinculo
		}
	});

	PolygonMarkers = L.geoJSON(polygons, {

		style: function (Feature) {
			switch (Feature.properties.Subcategoria) {
				case "Geológico": return PolygonsGeologico;
				case "Ecológico": return PolygonsEcologico;
				case "Biológico": return PolygonsBiologico;
				case "Hidrológico": return PolygonsHidrologico;
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
	Papa.parse(sheetsUrlPolygons, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: function (polygonsResults) {
			var polygonsData = polygonsResults.data
			
			polygonsData.map((data, index) => {
				data.geometry ? addPolygons(data) : polygonsData.splice(index, 1)
			})
		}
	})
}

window.addEventListener('DOMContentLoaded', init)
