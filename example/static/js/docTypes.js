(function () {
    const documentTypes = [{
        id: "rental_agreement",
        name: "Rental Agreement"
    }, {
        id: "gas_certificate",
        name: "Gas Certificate"
    }, {
        id: "electricity_certificate",
        name: "Electricity Certificate"
    }, {
        id: "energy_certificate",
        name: "Energy Certificate"
    }, {
        id: "inventory_inspection",
        name: "Inventory Inspection"
    }, {
        id: "property_details_brochure",
        name: "Property Details Brochure"
    }, {
        id: "fire_risk_assessment",
        name: "Fire Risk Assessment"
    }, {
        id: "works_estimate_report",
        name: "Works Estimate Report"
    }, {
        id: "asbestos_check",
        name: "Asbestos Check"
    }];
    const select = document.getElementById('document-types-select');
    documentTypes.forEach((docType) => {
       const option = document.createElement('option');
       option.value = docType.id;
       option.innerText = docType.name;
       select.appendChild(option);
    });
})();
