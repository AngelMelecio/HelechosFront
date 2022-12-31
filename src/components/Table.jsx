import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { AiOutlineConsoleSql } from "react-icons/ai"
import { ICONS } from "../constants/icons"

const Table = ({ items, columns }) => {

  const [visibleItems, setVisibleItems] = useState([])
  const [searchText, setSearchText] = useState('')

  const [sortParams, setSortParams] = useState({ attribute: null, criteria: null })

  const searchRef = useRef()
  const someSelectedRef = useRef()
  const trashButtonRef = useRef()

  useEffect(() => {
    setVisibleItems(items)
  }, [])

  useEffect(() => {
    hideShowOptions(isSelected())
  }, [visibleItems])
  
  useEffect(()=>{
    handleSearch()
  },[sortParams])

  const isSelected = () => {
    let sel = false
    visibleItems.forEach(e => {
      if (e.isSelected) sel = true
    })
    return sel
  }

  const handleSearchButtonClick = () => {
    if (searchText.length > 0) {
      searchRef.current.blur()
      setSearchText('')
      setVisibleItems( sortItems() )
      return
    }
    searchRef.current.focus()
  }

  const handleSelection = (e) => {
    setVisibleItems(prev => prev.map((empl, indx) => (
      indx === Number(e.target.value) ?
        { ...empl, isSelected: e.target.checked } :
        { ...empl }
    )))
  }
  
  const hideShowOptions = (a) => {
    someSelectedRef.current.checked = a
    someSelectedRef.current.disabled = !a
    
  }
  
  const handleSearch = () => {
    let val = (searchRef.current.value).trim().toLowerCase()
    let sortedItems = sortItems()
    let newItems = [...sortedItems].filter(e => {
      let E = JSON.stringify(e).toLowerCase()
      return E.includes(val)
    })
    hideShowOptions(false)
    setVisibleItems(newItems)
  }

 

  const sortItems = () => {

    if (sortParams.criteria === 0 || sortParams.criteria === null) {
      return [...items]
    }
    else {
      let newOrder = ( [...items].sort((a, b) => {
        let A = a[sortParams.attribute].toLowerCase()
        let B = b[sortParams.attribute].toLowerCase()

        if (A > B)
          return sortParams.criteria === 1 ? 1 : -1
        else if (A < B)
          return sortParams.criteria === 2 ? 1 : -1
        return 0
      }))
      return newOrder
    }
  }


  const onSortCriteriaChange = (attr) => {
    let newC
    if (sortParams.attribute === attr)
      newC = { ...sortParams, criteria: (sortParams.criteria + 1) % 3 }
    else 
      newC = { attribute: attr, criteria: 1 }
    setSortParams(newC)
    sortItems()
  }

  const unSelecAll = () => {
    setVisibleItems(prev => prev.map(item => ({ ...item, isSelected: false })))
    hideShowOptions(false)
  }

  const CustomRow = ({ element, onClick }) => {
    return (
      <>
        {
          columns.map((c, i) =>
            <td
              className="px-4"
              key={'td' + i}
              onClick={onClick}>
              {element[c.attribute]}
            </td>
          )
        }
      </>
    )
  }

  const ThIcon = ({ attribute }) => {
    if (attribute === sortParams.attribute) {
      if (sortParams.criteria === 0)
        return <ICONS.Filter className="filter-button" />
      else if (sortParams.criteria === 1)
        return <ICONS.DownFill />
      else
        return <ICONS.UpFill />
    }
    else
      return <ICONS.Filter className="filter-button" />
  }

  return (
    <div className="flex flex-col w-full h-full bg-white ">
      <div
        className="flex flex-row justify-between p-5"
        id="options-bar" >
        <div
          className="flex flex-row"
          id="butons">
          <button

            className='bg-teal-500 text-white w-8 h-8 total-center normalButton rounded-lg'>
            <ICONS.Plus size='16px' />
          </button>
          <button
            disabled={ !isSelected() }
            ref={trashButtonRef}
            className={'total-center ml-4 w-8 h-8 trash-button rounded-lg'}>
            <ICONS.Trash size='19px'  />
          </button>
        </div>
        <div
          id="searchbar"
          className="flex relative w-80 items-center">
          <input
            id='search-input'
            className='w-full h-full pr-10 rounded-2xl py-1 pl-3 outline-none bg-gray-100'
            ref={searchRef}
            onChange={(e) => {
              setSearchText(e.target.value)
              handleSearch()
            }}
            value={searchText}
            type="text"
          />
          <button
            onClick={handleSearchButtonClick}
            className='h-6 w-6 absolute right-1 total-center opacity-white rounded-2xl'>
            {
              searchText.length > 0 ?
                <ICONS.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                <ICONS.Lupa size='13px' style={{ color: '#4b5563' }} />
            }
          </button>
        </div>
      </div>
      <div
        id="table-container"
        className=" flex h-full w-full relative bg-white">
        <div className="w-full overflow-scroll bg-white shadow-md">
          <table className="customTable">
            <thead className='text-center'>
              <tr>
                <th className="px-7 h-7" >
                  <input
                    onChange={unSelecAll}
                    ref={someSelectedRef}
                    type="checkbox"
                    disabled />
                </th>
                {
                  columns.map((c, i) =>
                    <th className='p-2 font-semibold text-teal-800' key={"C" + i} >
                      {<div className="flex flex-row relative total-center text-center">
                        <p className="px-6">{c.name} </p>
                        <button
                          onClick={ () => onSortCriteriaChange(c.attribute) }
                          className="absolute right-0 h-4 w-4 total-center">
                          <ThIcon attribute={c.attribute} />
                        </button>
                      </div>}
                    </th>)
                }
              </tr>
            </thead>
            <tbody>
              {
                visibleItems.map((e, i) =>
                  <tr key={"E" + i} >
                    <td className="total-center h-7 px-7 " >
                      <div className="inp-container">
                        <input
                          value={i}
                          className='inp-check'
                          type="checkbox"
                          onChange={handleSelection}
                          checked={e.isSelected}
                        />
                      </div>
                    </td>
                    <CustomRow element={e} index={i} onClick={() => console.log('quiero editar')} />
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Table