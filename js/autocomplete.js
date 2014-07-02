var autocomplete_countries = [
	"Afghanistan",
	"Germany",
	"France",
	"Belgium",
	"Holland"
];

var autocomplete_continents = [
	"Africa",
	"Europe",
	"Asia",
	"North America",
	"South America",
	"Australia",
	"Artica"
];

$( ".country_input" ).autocomplete({
	source: autocomplete_countries
});

function init_autocomplete_arrays() {
	// TODO
}
