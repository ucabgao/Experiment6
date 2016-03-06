var fs        = require('fs'),
    expect    = require('chai').expect,
    sinon     = require('sinon');
    installer = require('../index'),
    fixture   = __dirname + '/fixtures/external-scripts.json';


function createFixture (callback) {
  fs.writeFile(fixture,'["script1","script2"]', callback);
}

function removeFixture (callback) {
  fs.unlink(fixture,callback);
}


describe("Hubot Script Installer", function(){

  beforeEach(function (done){
    createFixture(function(err){
      if (err) { return done(err); }
      done();
    });
  });

  afterEach(function(done){
    removeFixture(function(err){
      if (err) { return done(err); }
      done();
    });
  });
  
  it("Read external-scripts.json if it exists",function(done){
    installer.read(fixture, function(err,manifest){
      expect(manifest).to.be.an('array');
      expect(manifest).to.have.length(2);
      expect(manifest).to.have.deep.property('[0]','script1');
      done();
    });

  });
  
  it("Error if external-scripts.json doesn't exist",function(done){
    installer.read('non-existant-file.json', function(err,manifest){
      expect(err).to.be.ok;
      expect(manifest).to.not.be.ok;
      done();
    });

  });

  it("Add script to external-scripts.json",function(done){
    sinon.stub(installer, 'getName').returns('testscript');
    installer.install(fixture, function(err){
      if (err) { done(err); }
      
      installer.read(fixture,function(err,data){
        if (err) { done(err); }
        expect(data).to.be.an.array;
        expect(data).to.have.length(3);
        done();
        installer.getName.restore();

      });
      
    });

  });

  
  it("Remove script from external-scripts.json",function(done){
    sinon.stub(installer, 'getName').returns('script2');
    installer.uninstall(fixture,function(err){
      if (err) { return done(err); }
      installer.read(fixture, function (err,data) {
        if (err) { return done(err); }
        expect(data).to.have.length(1);
        done();
        installer.getName.restore();
      });
    });

  });


  it("Throw error when uninstalling non-existant script", function(done){
    sinon.stub(installer, 'getName').returns('testscript');
    installer.uninstall(fixture, function (err) {
      expect(err).to.be.ok
      done();
      installer.getName.restore();
    });
  });


  it("Get the name of the script", function(){
    var name = installer.getName(__dirname + '/fixtures/package.json');
    expect(name).to.equal('new-script');

  });
    

});
    