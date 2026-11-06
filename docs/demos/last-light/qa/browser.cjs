// Intended for a permitted browser host. This file was not run in the build sandbox.
const {
  chromium
}
=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
  const url=process.argv[2]||'http://localhost:8000/docs/demos/last-light/',out=process.argv[3]||'/tmp/last-light-browser';
  fs.mkdirSync(out,{
    recursive:true
  }
  );
  const browser=await chromium.launch(process.env.CHROMIUM_PATH?{
    executablePath:process.env.CHROMIUM_PATH
  }
  :{
  }
  );
  try{
    const page=await browser.newPage({
      viewport:{
        width:1440,height:960
      }
    }
    );
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(()=>LastLightInspection.ready());
    await page.screenshot({
      path:path.join(out,'title.png')
    }
    );
    await page.getByRole('button',{
      name:'Step into the rain'
    }
    ).click();
    await page.waitForFunction(()=>LastLightInspection.snapshot().phase==='choice',{
    }
    ,{
      timeout:25000
    }
    );
    await page.screenshot({
      path:path.join(out,'choice-desktop.png')
    }
    );
    await page.getByRole('button',{
      name:'Pause story'
    }
    ).click();
    const before=await page.evaluate(()=>LastLightInspection.snapshot().time);
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(()=>LastLightInspection.snapshot().time),before);
    await page.locator('#resume').click();
    await page.getByRole('button',{
      name:'Keep the light on the shore',exact:true
    }
    ).focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>LastLightInspection.snapshot().phase==='ended',{
    }
    ,{
      timeout:50000
    }
    );
    assert.equal(await page.evaluate(()=>LastLightInspection.snapshot().choice),'shore');
    await page.screenshot({
      path:path.join(out,'shore-ending.png')
    }
    );
    await page.setViewportSize({
      width:390,height:844
    }
    );
    await page.getByRole('button',{
      name:/Return to the shore/
    }
    ).click();
    await page.waitForFunction(()=>LastLightInspection.snapshot().phase==='choice',{
    }
    ,{
      timeout:25000
    }
    );
    await page.screenshot({
      path:path.join(out,'choice-mobile.png')
    }
    );
    await page.getByRole('button',{
      name:'Give the light to the traveler',exact:true
    }
    ).click();
    await page.waitForFunction(()=>LastLightInspection.snapshot().phase==='ended',{
    }
    ,{
      timeout:50000
    }
    );
    assert.equal(await page.evaluate(()=>LastLightInspection.snapshot().choice),'boat');
    await page.screenshot({
      path:path.join(out,'traveler-ending-mobile.png')
    }
    );
    assert.deepEqual(errors,[]);
    console.log('PASS: actual browser desktop/mobile, keyboard shore choice, traveler choice, pause, replay, no page errors. Still not physical device, listening or screen-reader QA.');
  }
  finally{
    await browser.close();
  }
}
)().catch(e=>{
  console.error(e);
  process.exitCode=1;
}
);
