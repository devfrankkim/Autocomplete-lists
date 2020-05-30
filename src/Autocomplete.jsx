import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  &, * {box-sizing: border-box; }
  ul {
    position: absolute;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 2px solid #eee;
    margin-top: -20px;
    padding-top: 20px;
  }
  input {
    position: relative;
    z-index: 2;
  }
`;

const Input = styled.input`
  height: 40px;
  border-radius: 20px;
  border: 2px solid #eee;
  outline: none;
  padding: 0 20px;
  font-size: 18px;
  transition: all 0.1s;
  width: 100%;

  &:hover {
    border-color: #ddd;
  }
  &:focus {
    border-color: #0055ff;
    background: #f0f0f0;
  }
`;


const ResultItem = styled.li`
  /* Adapt the colors based on primary prop */
  display: flex;
  background: ${props => props.focus ? "#dce7ff" : "white"};
  list-style: none;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  cursor: pointer;
  align-items: center;

  img {
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;


export const Autocomplete = ({
  onChange
}) => {
  // State hook to manage the list of users that we've queried
  const [results, setResults] = useState(null);
  // Which result item is currently focused on
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [value, setValue] = useState();

  const [focused, setFocused] = useState(false);

  const search = async q => {
    if (!q) return;
    const res = await axios(`http://localhost:9999/search?q=${q}`);
    setResults(res.data);
  }

  const handleKey = e => {

    switch(e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.stopPropagation();
        e.preventDefault();
        let newIndex = hoveredIndex + (e.key === 'ArrowDown' ? 1 : -1);
        if (newIndex < 0) newIndex = results.length - 1;
        if (newIndex >= results.length) newIndex = 0;
        setHoveredIndex(newIndex);
        break;

      case 'Enter':
        const result = results[hoveredIndex];
        if (result) {
          select(result);
          setFocused(false);
        }
        break;

      default:
        search(query);
        return;
    }
  }

  const select = (result) => {
    setValue(result);
  }

  const hide = () => {
    setTimeout(() => setFocused(false), 100);
  }

  useEffect(() => {
    if (!results) return;
    const cur = results[hoveredIndex];
    setQuery(`${cur.name.first} ${cur.name.last}`);
  }, [hoveredIndex]);


  // Listen for value change, and call the onChange prop
  useEffect(() => {
    if (onChange) onChange(value);
  }, [value]);


  return <><Wrapper>
    <Input
      type="text"
      onChange={e => setQuery(e.target.value)}
      onKeyDown={handleKey}
      value={query}
      onFocus={() => setFocused(true)}
      onBlur={hide}
    />

    {results && focused && <ul className="results">
      {results.map((r, i) => <ResultItem
        key={i}
        focus={i === hoveredIndex}
        onMouseEnter={() => setHoveredIndex(i)}
        onClick={() => select(r)}
      >
        <img src={r.picture.thumbnail} />
        {r.name.first} {r.name.last}
      </ResultItem>)}
    </ul>}
  </Wrapper>
  </>;
}
