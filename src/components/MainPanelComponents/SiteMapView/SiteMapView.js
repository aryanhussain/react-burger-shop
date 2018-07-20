import React, { Component } from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps";





class SiteMapView extends Component {

    constructor(props) {
        super(props);
        this.googleChecker = this.googleChecker.bind(this);
        this.renderMap = this.renderMap.bind(this);
    }

    map = null;
    componentDidMount() {
        console.log(this.props)
        this.googleChecker();
    }

    renderMap() {
        const coords = { lat: 41.375885, lng: 2.177813 };
        var marker = {};
        const mapProp = {
            center: {
                lat: coords.lat,
                lng: coords.lng
            },
            zoom: 3,
            mapTypeId: window.google.maps.MapTypeId.SATELLITE
        };
        // create map instance
        var map = new window.google.maps.Map(this.refs.mapContainer,mapProp);
        const infoWindow = new window.google.maps.InfoWindow();
        var that = this;
        this.props.selectedsitedata.map(element =>{
        this.getSiteLatLongAsyc(element).then(latLong => {
            if (latLong) {
                debugger;
                var icon = {
                  url: element.DamageCount > 0 ? "assets/images/eolic-energy.png" : "assets/images/active_turbine.png", // url
                  scaledSize: new window.google.maps.Size(25, 25), // scaled size
                };
    
                marker[element.SiteProfileId] = new window.google.maps.Marker({
                  position: { lat: latLong.lat(), lng: latLong.lng() },
                  title: element.SiteName,
                  icon: icon,
                });
                marker[element.SiteProfileId].setMap(map);
    
                window.google.maps.event.addListener(marker[element.SiteProfileId], 'click', (function (t, i) {
                  infoWindow.setOptions({
                    content: that._mapViewService.generateHtml(element, that),
                    position: { lat: latLong.lat(), lng: latLong.lng() }
                  });
                  infoWindow.open(map);
                  if (element.DamageClassification.length > 0) {
                    const makeChart = [];
                    element.DamageClassification.forEach(el => {
                      makeChart.push({
                        label: el.Severity,
                        value: el.SeverityCount,
                        color: that.getcolor(el.Severity)
                      });
                    });
                    setTimeout(() => {
                      that.loadPieChart(element, makeChart);
                    }, 100);
                  }
                }));
    
              } else {
                //console.log('Geocode was not successful for the following reason: ' + status);
              }
            
        })
        })
    }


    googleChecker() {
        // check for maps in case you're using other google api
        if (!window.google) {
            setTimeout(this.googleChecker, 100);
            console.log("not there yet");
        } else {
            console.log("we're good to go!!");
            // the google maps api is ready to use, render the map
            this.renderMap();
        }
    }


    getSiteLatLongAsyc(siteMapData) {
        const google = window.google;
        console.log(google)
        return new Promise(resolve => {
            let latLong;
            const geoCoder = new window.window.google.maps.Geocoder();
            geoCoder.geocode({ 'address': siteMapData.Address }, function (results, status) {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    latLong = results[0].geometry.location;
                    resolve(latLong);
                }
            });
        });
    }

    render() {
        return (
            // <GoogleMap
            //     defaultZoom={8}
            //     defaultCenter={{ lat: -34.397, lng: 150.644 }}

            // >
            // </GoogleMap>

            <div className="card map-holder">
                <div className="card-block" ref="mapContainer" style={{height:'700px', width:'100%'}} />
            </div>

        )
    }
}

export default SiteMapView