import React, { useState } from 'react';
import {render} from 'react-dom';
import {Autocomplete} from './Autocomplete';

const App = () => {
  const [value, setValue] = useState();
  return <>
    <Autocomplete onChange={v => setValue(v)} />
    {value &&
      <p>
        <img src={value.picture.large} />
        You selected {value.name.first} {value.name.last}<br />
        Their email is: {value.email}
      </p>
    }
  </>;
}


render(
  <App />,
  document.getElementById('app')
);
