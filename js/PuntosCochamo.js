var sheetsUrlPoints = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXfUOg9pNPNi2EQiw-iyrLCt8ywM7FhZJaZ3EWpu4rtU4ZmzIajonwZdt-_m1EuLq0d0J0iUIgiuvq/pub?gid=0&single=true&output=csv"

function addPoints(data) {

	var pointsCoordinates = JSON.parse(data.geometry)

	var points = {
		"type": "FeatureCollection",
		"features": []
	}

	points.features.push({
		"type": "Feature",
		"geometry": {
			"type": "MultiPoint",
			"coordinates": pointsCoordinates
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

	PointMarkers = L.geoJSON(points, {

		pointToLayer: function (Feature, pointsCoordinates) {
			switch (Feature.properties.Subcategoria) {
				case "Natural": return L.circleMarker(pointsCoordinates, {
					color: "#1f140f",
					weight: 1,
					radius: 8,
					fillColor: "#f2f3f7",
					pane: "PointsPane"
				});
				case "Ecológico": return L.circleMarker(pointsCoordinates, {
					color: "#1f140f",
					weight: 1,
					radius: 8,
					fillColor: "#f06102",
					pane: "PointsPane"
				});
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
	Papa.parse(sheetsUrlPoints, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: function (pointsResults) {
			var pointsData = pointsResults.data

			pointsData.map((data, index) => {
				data.geometry ? addPoints(data) : pointsData.splice(index, 1)
			})
		}
	})
}

window.addEventListener('DOMContentLoaded', init)
