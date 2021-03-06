window.onload = myFunc;

function myFunc() {
	d3.select('.body').style("height", (window.innerHeight-200)+'px');
	d3.select('#hpms-map')
		.style('width', d3.select('.body').node().offsetWidth+'px')
		.style('height', (window.innerHeight-200)+'px');

	d3.select('#hpms-interstates')
		.style('width', d3.select('.body').node().offsetWidth+'px')
		.style('height', (window.innerHeight-200)+'px');

	d3.select('#hpms-data')
		.style('width', d3.select('.body').node().offsetWidth+'px')
		.style('height', (window.innerHeight-200)+'px');

	avlmenu.Footer()
		.init(d3.select('body'))
		.text('Powered by avl, a product of AVAIL')();

	hpms_menu.init();
	hpms_map.init();
	hpms_interstates.init();
	hpms_data.init();
}