import { useContext } from 'react'
import Graph from './components/Graph'
import { Grid } from '@mui/material'
import Menu from './components/Menu'
import { Database } from 'src/types'
import { MigrationContext } from './contexts/MigrationContext'

function App(): JSX.Element {
  const { tableData, setTableData } = useContext(MigrationContext)

  const handleConnectToSql = async () => {
    const config = {
      host: 'localhost',
      databaseName: 'AdventureWorks',
      username: 'sa',
      password: 'password1!',
      dialect: 'mssql'
    }

    try {
      const database: Database = await window.api.connectToSql(config)
      setTableData(database?.schemas.flatMap((s) => s.tables))
    } catch (error) {
      console.error('Error connecting to SQL server:', error)
    }
  }

  const handleConnectToNeo4j = async () => {
    await window.api.connectToNeo4j({
      uri: 'neo4j://localhost:7687',
      username: 'neo4j',
      password: 'password1!'
    })
  }

  const handleCreateNodes = async () => {
    await window.api.createNodes()
  }

  const handleCreateRelationships = async () => {
    await window.api.createRelationships()
  }
  // return (
  //   <div className="container">
  //     <Versions></Versions>

  //     <svg className="hero-logo" viewBox="0 0 900 300">
  //       <use xlinkHref={`${icons}#electron`} />
  //     </svg>
  //     <h2 className="hero-text">
  //       You{"'"}ve successfully created an Electron project with React and TypeScript
  //     </h2>
  //     <p className="hero-tagline">
  //       Please try pressing <code>F12</code> to open the devTool
  //     </p>

  //     <div className="links">
  //       <div className="link-item">
  //         <a target="_blank" href="https://evite.netlify.app" rel="noopener noreferrer">
  //           Documentation
  //         </a>
  //       </div>
  //       <div className="link-item link-dot">•</div>
  //       <div className="link-item">
  //         <a
  //           target="_blank"
  //           href="https://github.com/alex8088/electron-vite"
  //           rel="noopener noreferrer"
  //         >
  //           Getting Help
  //         </a>
  //       </div>
  //       <div className="link-item link-dot">•</div>
  //       <div className="link-item">
  //         <a
  //           target="_blank"
  //           href="https://github.com/alex8088/quick-start/tree/master/packages/create-electron"
  //           rel="noopener noreferrer"
  //         >
  //           create-electron
  //         </a>
  //       </div>
  //     </div>

  //     <div className="features">
  //       <div className="feature-item">
  //         <article>
  //           <h2 className="title">Configuring</h2>
  //           <p className="detail">
  //             Config with <span>electron.vite.config.ts</span> and refer to the{' '}
  //             <a target="_blank" href="https://evite.netlify.app/config/" rel="noopener noreferrer">
  //               config guide
  //             </a>
  //             .
  //           </p>
  //         </article>
  //       </div>
  //       <div className="feature-item">
  //         <article>
  //           <h2 className="title">HMR</h2>
  //           <p className="detail">
  //             Edit <span>src/renderer</span> files to test HMR. See{' '}
  //             <a
  //               target="_blank"
  //               href="https://evite.netlify.app/guide/hmr-in-renderer.html"
  //               rel="noopener noreferrer"
  //             >
  //               docs
  //             </a>
  //             .
  //           </p>
  //         </article>
  //       </div>
  //       <div className="feature-item">
  //         <article>
  //           <h2 className="title">Hot Reloading</h2>
  //           <p className="detail">
  //             Run{' '}
  //             <span>
  //               {"'"}electron-vite dev --watch{"'"}
  //             </span>{' '}
  //             to enable. See{' '}
  //             <a
  //               target="_blank"
  //               href="https://evite.netlify.app/guide/hot-reloading.html"
  //               rel="noopener noreferrer"
  //             >
  //               docs
  //             </a>
  //             .
  //           </p>
  //         </article>
  //       </div>
  //       <div className="feature-item">
  //         <article>
  //           <h2 className="title">Debugging</h2>
  //           <p className="detail">
  //             Check out <span>.vscode/launch.json</span>. See{' '}
  //             <a
  //               target="_blank"
  //               href="https://evite.netlify.app/guide/debugging.html"
  //               rel="noopener noreferrer"
  //             >
  //               docs
  //             </a>
  //             .
  //           </p>
  //         </article>
  //       </div>
  //       <div className="feature-item">
  //         <article>
  //           <h2 className="title">Source Code Protection</h2>
  //           <p className="detail">
  //             Supported via built-in plugin <span>bytecodePlugin</span>. See{' '}
  //             <a
  //               target="_blank"
  //               href="https://evite.netlify.app/guide/source-code-protection.html"
  //               rel="noopener noreferrer"
  //             >
  //               docs
  //             </a>
  //             .
  //           </p>
  //         </article>
  //       </div>
  //       <div className="feature-item">
  //         <article>
  //           <h2 className="title">Packaging</h2>
  //           <p className="detail">
  //             Use{' '}
  //             <a target="_blank" href="https://www.electron.build" rel="noopener noreferrer">
  //               electron-builder
  //             </a>{' '}
  //             and pre-configured to pack your app.
  //           </p>
  //         </article>
  //       </div>
  //     </div>
  //   </div>
  // )
  return (
    <>
      <>
        <button onClick={handleConnectToSql}>Connect Sql</button>
        <button onClick={handleConnectToNeo4j}>Connect Neo4j</button>
        <button onClick={handleCreateNodes}>Create Nodes</button>
        <button onClick={handleCreateRelationships}>Create Relationships</button>
      </>
      {tableData.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <Menu />
          </Grid>
          <Grid item xs={7}>
            <Graph />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default App
