import React from 'react';
import { useState } from 'react';
import Select from 'react-select';
import zklist from '../assetts/zklist.json';
import zktags from '../assetts/zktags.json';
import taglist from '../assetts/tagsdistinct.json';

const List = ( ) => {
    const [selected, setSelected] = useState([]);
    const options = taglist.filter(e => e != "zk").map((tag) => {return {value: tag, label: tag}});
    if (taglist) {
	return (
	    <>
		<div class="p-4 w-96 sm:w-1/2">
		    <Select
			options={options}
			onChange={(e) => setSelected(e)}
			isMulti
			placeholder="Select Tag(s)..." />
		    <div class="px-4 pt-4">
			<ul class="px-4 pb-3 sm:px-8 list-disc">
			    {Object.keys(zklist).map((item) => {
				if (selected.length == 0 || selected.map((e) => e.label).some(r=> zktags[zklist[item][1]].includes(r))) {
				    return (
					<li> <a href={"./zk/" + item}> {zklist[item][0]} </a></li>
				    )} else { return ""}
			    })}
			</ul>
		    </div>
		</div>
	    </>
	)
    } else {
	<p>Loading</p>
    }
}

export default List
