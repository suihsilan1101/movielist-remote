//（）為IIFFEE將函式變為立即函式
(
  function () {
    //先設置好API網址存進變數(全部電影清單,單一電影資料)
    //主機位址
    const BASE_URL = 'https://movie-list.alphacamp.io/'
    //全部的電影資料位置
    const INDEX_URL = BASE_URL + 'api/v1/movies/'
    //設置單一電影位置
    const POSTER_URL = BASE_URL + 'posters/'
    //設置變數存取api回傳的JSON資料
    let data = []
    //抓取data-panel區塊
    const dataPanel = document.querySelector('#data-panel')
    //先運用axios連結上api的資料
    axios.get(INDEX_URL)
      .then(res => {
        //方法2 運用spread operater展開運算子>展開陣列元素》把陣列三層去除掉
        console.log(res.data.results)
        data.push(...res.data.results)
        // displayDataList(data)//將api的資料渲染到畫面上
        getTotalPages(data)//將渲染的資料分成分頁12頁
        getPageData(1, data) //這裡的data是ajax從api抓取的全域變數總資料
      })
      .catch(error => {
        console.log(error)
      })
    //綁定元素
    //modal-header
    const movieTitle = document.querySelector('#show-movie-title')
    //modal-body > img > reslease date > description
    const movieImg = document.querySelector('#show-movie-image')
    const movieDate = document.querySelector('#show-movie-date')
    const movieDes = document.querySelector('#show-movie-description')
    //50個按鈕監聽>綁定在父元素datapanel
    dataPanel.addEventListener('click', (event) => {
      //只要class選擇器中含有button的相應class
      if (event.target.matches('.btn-show-movie')) {
        //但我們要讓按鈕告訴我們是哪部電影 所以可以使用dataset先在按鈕上設置獨特相應的電影id
        console.log(event.target.dataset.id)
        showsinglemovie(event.target.dataset.id)
      } else if (event.target.matches('.btn-add-favorite')) {
        //監聽收藏按鈕的點擊事件
        console.log(event.target.dataset.id)
        addFavoriteItem(event.target.dataset.id)
      }
    })


    //新增function 將電影資料寫入
    function displayDataList(data) {
      let htmlContent = ''
      data.forEach(function (item) {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>
           
            <!-- Button trigger modal -->
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#show-movie-modal" data-id="${item.id}">
                More
              </button>
            <!-- favorite button 在電影卡片上增加收藏按鈕-->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">收藏</button>
            </div>
          </div>
        </div>
      `
      })

      dataPanel.innerHTML = htmlContent
    }


    //新增modal單筆電影資料：另獨立於一個函式
    function showsinglemovie(id) {
      let url = INDEX_URL + id
      //找單筆電影資料
      axios
        .get(url)
        .then((res) => {
          //變數只會存活於此
          let data = res.data.results
          console.log(data)
          movieTitle.innerHTML = `${data.title}`
          //記得這裡要插入img標籤並在src中連上正確圖片位置
          movieImg.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt = "Responsive image" >`
          movieDate.innerHTML = `release_date： ${data.release_date}`
          movieDes.innerHTML = `${data.description}`
        })
        .catch((err) => {
          console.log(err)
        })
    }

    //撰寫addFavoriteItem（）將使用者想收藏的電影送進 local storage 儲存起來
    function addFavoriteItem(id) {
      //local storage 裡的 value 是 string type，也就是存入 data 時需要呼叫 JSON.stringify(obj)，而取出時需要呼叫 JSON.parse(value)
      //若使用者是第一次使用收藏功能，則 localStorage.getItem('favoriteMovies') 會找不到東西，所以需要建立一個空 Array
      const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
      //data.find(item => item.id === Number(id)) 是從電影總表中找出 id 符合條件的電影物件，find 可以依條件檢查 Array，並且回傳第一個符合條件的值
      const movie = data.find(item => item.id === Number(id)) //從 HTML 取出的 id 會是 string type，而經過 JSON.parse 之後的 id 會是 number type，所以使用 === 的時候要小心

      if (list.some(item => item.id === Number(id))) {
        //部分符合就會顯示為true 
        alert(`${movie.title} is already in your favorite list.`)
      } else {
        list.push(movie)
        alert(`Added ${movie.title} to your favorite list!`)
      }
      //local storage 裡的 value 是 string type，存入 data 時需要呼叫 JSON.stringify(obj)
      localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }

    //search bar 功能
    const searchForm = document.querySelector('#search')
    const searchInput = document.querySelector('#search-input')
    //在父元素search form掛在監聽器
    searchForm.addEventListener('submit', (event) => {
      //表單按鈕的預設行為
      //把 <form> 和 <button> 放在一起時，<button> 的預設行為是「將表單內容透過 HTTP request 提交給遠端伺服器」，除非使用 Ajax 技術發送非同步請求，否則一般的 HTTP request 都會刷新瀏覽器畫面
      event.preventDefault()
      let results = []
      //把寫入在input的字串變成小寫
      // let input = searchInput.value.toLowerCase()
      //「當你把一個陣列傳給 filter 時，他會用一組條件式掃描舊陣列，然後回傳一個新陣列，在新陣列裡，只會保留條件式為 true 的項目。
      //使用.filter()方法篩選 > 他只會保留條件式為 true 的項目

      //設正規表達式
      //正規表達式是一種特殊字串，可以幫助我們針對字串進行 search, match, replace 等功能
      // 在 JavaScript 中，我們可以用下面這樣的方式來建立這種特殊字串
      //const regex = new RegExp('key', 'i')
      //用 console.log 來看剛剛建立的 regex 是什麼，就會看到 / key / i 這就是「正規表達式」特殊字串的表現形式 這裡的 i 代表的是 case insensitive，也就是不管大小寫，不管是 Key 還是 keY 都會回傳結果
      //我們要找一個句子裡面是否包含我們要找的詞，就可以用 match() 來檢查
      const regex = new RegExp(searchInput.value, 'i')

      // results = data.filter(movie =>
      //   //比對的資料中字串也全顯示為小寫以進行比對
      //   //利用includes(比對資料)
      //   movie.title.toLowerCase().includes(input)
      // )

      //正規表達式 
      results = data.filter(movie => movie.title.match(regex))

      console.log(results)
      //重新渲染頁（面 >只顯示符合條件的
      getTotalPages(results)
      getPageData(1, results)

    })

    //分頁功能
    const pagination = document.querySelector('#pagination')
    const ITEM_PER_PAGE = 12

    function getTotalPages(data) {
      let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
      let pageItemContent = `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
          <!-- << &laquo;和 >> &raquo;是特殊符號 -->
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      `
      for (let i = 0; i < totalPages; i++) {
        pageItemContent += `
          <li class="page-item">
            <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
          </li>
        `
      }
      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </a>
      </li>
      `
      pagination.innerHTML = pageItemContent
    }

    //新增分頁監聽器 
    pagination.addEventListener('click', event => {
      console.log(event.target.dataset.page)
      if (event.target.tagName === 'A') {
        getPageData(event.target.dataset.page)//將頁碼傳入 getPageData 來切換分頁
        //但此處卻沒有總資料data傳入 
      }
    })

    //排除疑難
    //getPageData() 同時被 上面axios 和 pagination.addEventListener 呼叫，然而後者沒有 總資料data 傳入，所以程式跑到getPageData（）中的 data.slice() 的時候就會發生錯誤
    //當使用者點擊 pagination 時，程序理應要用同一組 data 來繼續計算。要如何在 pagination.addEventListener 沒有傳入 data 的情況下，能夠知道要用「上次傳入的 data」來運算出正確的電影列表呢？
    //解決這個問題，我們需要在 getPageData 的外面設置一個變數 paginationData，讓 getPageData 擁有固定的資料來源：

    //如果呼叫 getPageData 時有電影資料被傳入，就用新傳入的資料作運算，然後 paginationData 會被刷新；
    //如果呼叫 getPageData 時沒有電影資料被傳入，則沿用 paginationData 裡的內容，確保 slice 始終有東西可以處理。
    let paginationData = []


    //function 取出特定頁面的資料
    //回顧：
    //let data = []
    //在axios.get(INDEX_URL)
    //.then(res => {
    //data.push(...res.data.results)
    // displayDataList(data)//將api的資料渲染到畫面上
    //getTotalPages(data)//將渲染的資料分成分頁12頁
    //getPageData(1, data) //這裡的data是ajax從api抓取的全域變數總資料
    //})
    function getPageData(pageNum, importedData) {
      paginationData = importedData || paginationData
      let offset = (pageNum - 1) * ITEM_PER_PAGE
      let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE) //.slice(起點,終點) 第二個參數是不被包含的
      displayDataList(pageData)
      //利用displaydatalist()函式傳入 演算資料至template分頁中
    }

    //搜尋結果也要分頁
    // searchForm.addEventListener('submit', event => {
    //   event.preventDefault()

    //   let results = []
    //   // 使用正規表達式
    //   const regex = new RegExp(searchInput.value, 'i')

    //   results = data.filter(movie => movie.title.match(regex))
    //   console.log(results)
    //   getTotalPages(results)
    //   getPageData(1, results)

    // })

  })() //這個iiffeee括號常忘記