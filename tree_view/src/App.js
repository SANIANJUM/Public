import './App.css';
import Nav from './Comp/nav';
import MaterialUi from './Comp/materialUi';
//import TreeMui from './Comp/treeMUI';
//import TreeMUI from './Comp/tree-mui'
//import Hit from './Comp/hits';

function App() {
  return (
    <div className="App">
      <Nav />
      <div class="center-screen scroller"><MaterialUi /></div>
    </div>
  );
}

export default App;
