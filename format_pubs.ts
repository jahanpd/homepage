import Cite from 'citation-js';
import * as fs from "fs"

const getCitation = async (doi: string) => {
    const options = {
	redirect: "follow",
	headers: {
	    Accept: "application/x-bibtex"
	}
    }
    const data = await fetch(doi, options).then(r => r.text());
    const citor = new Cite(data);
    return citor.format('bibliography', {format: 'text', template: 'harvard1', lang: 'en-US'})
};

// Function to create a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Main function to process array with rate limiting
const processArray = async (array: string[]) => {
    let citations = [];
    for (let item of array) {
	const data = await getCitation(item);
	console.log(data)
	citations.push(data);
	await delay(50); // Wait befor next iteration
    }
    return citations
};

const format_pubs = async () => {
		const my_publications = ["https://doi.org/10.1016/j.lanogw.2025.100005", "https://doi.org/10.48550/arXiv.2211.07059", "https://doi.org/10.1371/journal.pone.0289930","https://doi.org/10.3389/fcvm.2023.1211600","https://doi.org/10.1111/jocs.16842","https://doi.org/10.48550/ARXIV.2211.07059","https://doi.org/10.1053/j.semtcvs.2020.09.028","https://doi.org/10.1016/j.hlc.2016.04.016"];
		const other_publications = "https://doi.org/10.1213/ane.0000000000006624,https://doi.org/10.1053/j.jvca.2022.12.009,https://doi.org/10.1053/j.jvca.2022.11.015,https://doi.org/10.1016/j.hlc.2022.11.007,https://doi.org/10.1016/j.athoracsur.2023.02.054,https://doi.org/10.1111/ans.18595,https://doi.org/10.1371/journal.pone.0276509,https://doi.org/10.1007/s11748-022-01888-2,https://doi.org/10.3389/ti.2022.10362,https://doi.org/10.6002/ect.2021.0386,https://doi.org/10.1053/j.jvca.2021.07.001,https://doi.org/10.1186/s13019-022-01870-2,https://doi.org/10.1111/aas.14170,https://doi.org/10.1016/j.hlc.2021.05.101,https://doi.org/10.1097/txd.0000000000001261,https://doi.org/10.1111/aos.14955,https://doi.org/10.1016/j.surge.2020.02.007,https://doi.org/10.1111/ans.16615,https://doi.org/10.1111/ans.16898,https://doi.org/10.1016/j.jvs.2020.03.039,https://doi.org/10.1177/1538574420951315,https://doi.org/10.1016/j.hlc.2019.11.021,https://doi.org/10.2217/imt-2017-0183,https://doi.org/10.1093/annonc/mdx478,https://doi.org/10.1177/1747493018806167,https://doi.org/10.1136/esmoopen-2017-000200,https://doi.org/10.1093/annonc/mdx305,https://doi.org/10.1016/j.prrv.2016.10.005,https://doi.org/10.1002/14651858.cd005599.pub5,https://doi.org/10.1186/1471-2466-14-183".split(',');
		let citations = await processArray(my_publications);
		let citations2 = await processArray(other_publications);

		fs.writeFileSync("./src/assetts/my_citations.json", JSON.stringify(citations))
		fs.writeFileSync("./src/assetts/other_citations.json", JSON.stringify(citations2))
}

format_pubs().then((res) => console.log("saved citations formatted"))
