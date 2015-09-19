// Generated by CoffeeScript 1.10.0
var R, fs, get, getPreset, isThere, nocomments, obtain, path, sourcegate, task;

require("source-map-support").install();

R = require("ramda");

fs = require("fs");

path = require("path");

isThere = require("is-there");

sourcegate = require("sourcegate");

nocomments = require("strip-json-comments");

task = require("be-goods").gulpTask;

obtain = function(somewhere) {
  return JSON.parse(nocomments(fs.readFileSync(path.normalize(somewhere)).toString()));
};

get = function(what, module) {
  var e, error, i, j, last, ref, where;
  where = ["node_modules/" + what, "node_modules/" + module + "/node_modules/" + what, "node_modules/beverage/node_modules/" + module + "/node_modules/" + what];
  last = where.length - 1;
  for (i = j = 0, ref = last; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    try {
      return obtain(where[i]);
    } catch (error) {
      e = error;
      if (i === last) {
        console.error(e);
        throw new Error("Could not find preset at: " + where);
      }
      continue;
    }
  }
};

getPreset = function(tool, name, module) {
  var presets, ref;
  presets = {
    jscs: "jscs/presets",
    jshint: {
      airbnb: "airbnb-style/linters/jshintrc"
    },
    eslint: {
      airbnb: "airbnb-style/linters/.eslintrc"
    },
    coffeelint: {
      "coffeescript-style-guide": "coffeescript-style-guide/coffeelint.json"
    }
  };
  if (tool === "jscs") {
    return get(presets.jscs + "/" + name + ".json", module);
  } else if (((ref = presets[tool]) != null ? ref[name] : void 0) != null) {
    return get(presets[tool][name], module);
  } else {
    return {};
  }
};

module.exports = function(o, gulp) {
  var base, config, empty, filerc, j, len, module, prefix, preset, ready, ref, res, sg, sources, watch;
  if (o == null) {
    o = {};
  }
  empty = [[], {}];
  if (R.is(Array, o.sourcegate)) {
    if (R.isEmpty(o.sourcegate)) {
      return [empty];
    }
  } else {
    return [empty];
  }
  if (o.sourceopt == null) {
    o.sourceopt = {};
  }
  ready = [];
  watch = [];
  ref = o.sourcegate;
  for (j = 0, len = ref.length; j < len; j++) {
    sg = ref[j];
    res = R.clone(empty);
    if (sg.options == null) {
      sg.options = {};
    }
    if (sg.recipe == null) {
      res = [sg.sources, sg.options];
    } else {
      sources = [];
      module = sg.module || o.sourceopt.module;
      prefix = sg.prefix || o.sourceopt.prefix || '';
      preset = sg.preset || o.sourceopt.preset;
      if (preset != null) {
        sources.push(getPreset(sg.recipe, preset, module));
      }
      filerc = sg.recipe === "coffeelint" ? "coffeelint.json" : "." + sg.recipe + "rc";
      if (module != null) {
        config = "" + prefix + filerc;
        if (module) {
          config = "node_modules/" + module + "/" + config;
        }
        config = path.normalize(config);
        if (!isThere(config)) {
          console.error("Could not find: " + config);
        } else {
          if (o.sourceopt.watch) {
            watch.push(config);
          }
          sources.push(config);
        }
      }
      if ((base = sg.options).write == null) {
        base.write = {};
      }
      sg.options.write.path = filerc;
      if (sg.sources != null) {
        sources = sources.concat(sg.sources);
      }
      res = [sources, sg.options];
    }
    ready.push(res);
  }
  if (gulp != null) {
    task(gulp, "sourcegate", "Write sourcegate targets.", function() {
      var k, len1, results;
      results = [];
      for (k = 0, len1 = ready.length; k < len1; k++) {
        sg = ready[k];
        results.push(sourcegate.apply(null, sg));
      }
      return results;
    });
    if (o.sourceopt.watch) {
      task(gulp, "sourcegate:watch", "Watch sourcegate sources for changes.", function() {
        return gulp.watch(watch, ["sourcegate"]);
      });
    }
  }
  return ready;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixDQUFDLE9BQTlCLENBQUE7O0FBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxPQUFSOztBQUNKLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7QUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0FBQ1AsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztBQUNWLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsVUFBUixDQUFtQixDQUFDOztBQUkzQixNQUFBLEdBQVMsU0FBQyxTQUFEO1NBQ1AsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFBLENBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBSSxDQUFDLFNBQUwsQ0FBZSxTQUFmLENBQWhCLENBQXlDLENBQUMsUUFBMUMsQ0FBQSxDQUFYLENBQVg7QUFETzs7QUFHVCxHQUFBLEdBQU0sU0FBQyxJQUFELEVBQU8sTUFBUDtBQUVKLE1BQUE7RUFBQSxLQUFBLEdBQVEsQ0FDTixlQUFBLEdBQWdCLElBRFYsRUFFTixlQUFBLEdBQWdCLE1BQWhCLEdBQXVCLGdCQUF2QixHQUF1QyxJQUZqQyxFQUdOLHFDQUFBLEdBQXNDLE1BQXRDLEdBQTZDLGdCQUE3QyxHQUE2RCxJQUh2RDtFQU1SLElBQUEsR0FBTyxLQUFLLENBQUMsTUFBTixHQUFlO0FBQ3RCLE9BQVMsK0VBQVQ7QUFDRTtBQUNFLGFBQU8sTUFBQSxDQUFPLEtBQU0sQ0FBQSxDQUFBLENBQWIsRUFEVDtLQUFBLGFBQUE7TUFFTTtNQUNKLElBQUcsQ0FBQSxLQUFLLElBQVI7UUFDRSxPQUFPLENBQUMsS0FBUixDQUFjLENBQWQ7QUFDQSxjQUFVLElBQUEs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QUFDLEtBQUssQ0FBQyxJQUFqQixHQUF3QjtNQUV4QixJQUF3QyxrQkFBeEM7UUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLE1BQVIsQ0FBZSxFQUFFLENBQUMsT0FBbEIsRUFBVjs7TUFDQSxHQUFBLEdBQU0sQ0FBQyxPQUFELEVBQVUsRUFBRSxDQUFDLE9BQWIsRUEzQlI7O0lBNkJBLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWDtBQWpDRjtFQW9DQSxJQUFHLFlBQUg7SUFDRSxJQUFBLENBQUssSUFBTCxFQUFXLFlBQVgsRUFBeUIsMkJBQXpCLEVBQXNELFNBQUE7QUFDcEQsVUFBQTtBQUFBO1dBQUEseUNBQUE7O3FCQUNFLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLEVBQXVCLEVBQXZCO0FBREY7O0lBRG9ELENBQXREO0lBR0EsSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQWY7TUFDRSxJQUFBLENBQUssSUFBTCxFQUFXLGtCQUFYLEVBQ0UsdUNBREYsRUFDMkMsU0FBQTtlQUN2QyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBa0IsQ0FBQyxZQUFELENBQWxCO01BRHVDLENBRDNDLEVBREY7S0FKRjs7U0FTQTtBQXREZSIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnRcIikuaW5zdGFsbCgpXG5SID0gcmVxdWlyZShcInJhbWRhXCIpXG5mcyA9IHJlcXVpcmUoXCJmc1wiKVxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5pc1RoZXJlID0gcmVxdWlyZShcImlzLXRoZXJlXCIpXG5zb3VyY2VnYXRlID0gcmVxdWlyZShcInNvdXJjZWdhdGVcIilcbm5vY29tbWVudHMgPSByZXF1aXJlKFwic3RyaXAtanNvbi1jb21tZW50c1wiKVxudGFzayA9IHJlcXVpcmUoXCJiZS1nb29kc1wiKS5ndWxwVGFza1xuI2d1dGlsID0gcmVxdWlyZShcImd1bHAtdXRpbFwiKSAjIGtlZXAgY29tbWVuZWQtb3V0IG9yIG1vdmUgdG8gZGVwZW5kZW5jaWVzXG5cblxub2J0YWluID0gKHNvbWV3aGVyZSkgLT5cbiAgSlNPTi5wYXJzZSBub2NvbW1lbnRzIGZzLnJlYWRGaWxlU3luYyhwYXRoLm5vcm1hbGl6ZSBzb21ld2hlcmUpLnRvU3RyaW5nKClcblxuZ2V0ID0gKHdoYXQsIG1vZHVsZSkgLT5cbiAgIyBndXRpbC5sb2cgXCJmaW5kIHdoYXQgJyN7d2hhdH0nIGluIG1vZHVsZSAnI3ttb2R1bGV9J1wiXG4gIHdoZXJlID0gW1xuICAgIFwibm9kZV9tb2R1bGVzLyN7d2hhdH1cIixcbiAgICBcIm5vZGVfbW9kdWxlcy8je21vZHVsZX0vbm9kZV9tb2R1bGVzLyN7d2hhdH1cIixcbiAgICBcIm5vZGVfbW9kdWxlcy9iZXZlcmFnZS9ub2RlX21vZHVsZXMvI3ttb2R1bGV9L25vZGVfbW9kdWxlcy8je3doYXR9XCJcbiAgXVxuXG4gIGxhc3QgPSB3aGVyZS5sZW5ndGggLSAxXG4gIGZvciBpIGluIFswLi5sYXN0XVxuICAgIHRyeVxuICAgICAgcmV0dXJuIG9idGFpbiB3aGVyZVtpXVxuICAgIGNhdGNoIGVcbiAgICAgIGlmIGkgaXMgbGFzdFxuICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNvdWxkIG5vdCBmaW5kIHByZXNldCBhdDogI3t3aGVyZX1cIlxuICAgICAgY29udGludWVcblxuXG5nZXRQcmVzZXQgPSAodG9vbCwgbmFtZSwgbW9kdWxlKSAtPlxuICBwcmVzZXRzID1cbiAgICBqc2NzOiBcImpzY3MvcHJlc2V0c1wiICN7cHJlc2V0fS5qc29uIHdpbGwgYmUgYXBwZW5kZWRcbiAgICBqc2hpbnQ6XG4gICAgICBhaXJibmI6IFwiYWlyYm5iLXN0eWxlL2xpbnRlcnMvanNoaW50cmNcIlxuICAgIGVzbGludDpcbiAgICAgIGFpcmJuYjogXCJhaXJibmItc3R5bGUvbGludGVycy8uZXNsaW50cmNcIlxuICAgIGNvZmZlZWxpbnQ6XG4gICAgICBcImNvZmZlZXNjcmlwdC1zdHlsZS1ndWlkZVwiOiBcImNvZmZlZXNjcmlwdC1zdHlsZS1ndWlkZS9jb2ZmZWVsaW50Lmpzb25cIlxuXG4gIGlmIHRvb2wgaXMgXCJqc2NzXCJcbiAgICBnZXQoXCIje3ByZXNldHMuanNjc30vI3tuYW1lfS5qc29uXCIsIG1vZHVsZSlcbiAgZWxzZSBpZiBwcmVzZXRzW3Rvb2xdP1tuYW1lXT9cbiAgICBnZXQocHJlc2V0c1t0b29sXVtuYW1lXSwgbW9kdWxlKVxuICBlbHNlIHt9XG5cblxubW9kdWxlLmV4cG9ydHMgPSAobyA9IHt9LCBndWxwKSAtPlxuICBlbXB0eSA9IFtbXSwge31dXG4gIGlmIFIuaXMoQXJyYXksIG8uc291cmNlZ2F0ZSlcbiAgICBpZiBSLmlzRW1wdHkoby5zb3VyY2VnYXRlKSB0aGVuIHJldHVybiBbZW1wdHldXG4gIGVsc2UgcmV0dXJuIFtlbXB0eV0gIyBvciB0aHJvdz9cbiAgby5zb3VyY2VvcHQgPz0ge31cbiAgcmVhZHkgPSBbXVxuICB3YXRjaCA9IFtdXG5cbiAgZm9yIHNnIGluIG8uc291cmNlZ2F0ZVxuICAgIHJlcyA9IFIuY2xvbmUoZW1wdHkpXG4gICAgc2cub3B0aW9ucyA/PSB7fVxuXG4gICAgdW5sZXNzIHNnLnJlY2lwZT9cbiAgICAgICMgMC4gd2l0aG91dCBhIHJlY2lwZSwgaGFsLXJjIGp1c3QgaGFuZHMgc291cmNlcyBhbmQgb3B0aW9ucyB0byBzb3VyY2VnYXRlXG4gICAgICByZXMgPSBbc2cuc291cmNlcywgc2cub3B0aW9uc11cbiAgICBlbHNlXG4gICAgICBzb3VyY2VzID0gW11cbiAgICAgIG1vZHVsZSA9IHNnLm1vZHVsZSBvciBvLnNvdXJjZW9wdC5tb2R1bGVcbiAgICAgIHByZWZpeCA9IHNnLnByZWZpeCBvciBvLnNvdXJjZW9wdC5wcmVmaXggb3IgJydcbiAgICAgIHByZXNldCA9IHNnLnByZXNldCBvciBvLnNvdXJjZW9wdC5wcmVzZXRcbiAgICAgICMgMS4gc3RhcnQgd2l0aCBwcmVzZXQgKHNvbWV0aGluZyBrbm93biAvIHN0YW5kYXJkKVxuICAgICAgc291cmNlcy5wdXNoIGdldFByZXNldChzZy5yZWNpcGUsIHByZXNldCwgbW9kdWxlKSBpZiBwcmVzZXQ/XG4gICAgICBmaWxlcmMgPSBpZiBzZy5yZWNpcGUgaXMgXCJjb2ZmZWVsaW50XCIgdGhlbiBcImNvZmZlZWxpbnQuanNvblwiIGVsc2UgXCIuI3tzZy5yZWNpcGV9cmNcIlxuICAgICAgaWYgbW9kdWxlP1xuICAgICAgICAjIDIuIG92ZXJyaWRlIHdpdGggYSBtb2R1bGUgY29uZmlnIChhbnlib2R5IGNhbiBoYXZlIHByZXNldHMpXG4gICAgICAgIGNvbmZpZyA9IFwiI3twcmVmaXh9I3tmaWxlcmN9XCJcbiAgICAgICAgY29uZmlnID0gXCJub2RlX21vZHVsZXMvI3ttb2R1bGV9LyN7Y29uZmlnfVwiIGlmIG1vZHVsZSAjIGZhbHNlIGlzIGEgdmFsaWQgdmFsdWVcbiAgICAgICAgY29uZmlnID0gcGF0aC5ub3JtYWxpemUoY29uZmlnKVxuXG4gICAgICAgIHVubGVzcyBpc1RoZXJlIGNvbmZpZ1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgXCJDb3VsZCBub3QgZmluZDogI3tjb25maWd9XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIG8uc291cmNlb3B0LndhdGNoXG4gICAgICAgICAgICB3YXRjaC5wdXNoIGNvbmZpZ1xuICAgICAgICAgIHNvdXJjZXMucHVzaCBjb25maWdcbiAgICAgIHNnLm9wdGlvbnMud3JpdGUgPz0ge31cbiAgICAgIHNnLm9wdGlvbnMud3JpdGUucGF0aCA9IGZpbGVyY1xuICAgICAgIyAzLiBzb3VyY2VzLCB3aGV0aGVyIGFuIG9iamVjdCBvciBhcnJheSwgYmVjb21lIHRoZSBmaW5hbCBvdmVycmlkZVxuICAgICAgc291cmNlcyA9IHNvdXJjZXMuY29uY2F0KHNnLnNvdXJjZXMpIGlmIHNnLnNvdXJjZXM/XG4gICAgICByZXMgPSBbc291cmNlcywgc2cub3B0aW9uc11cblxuICAgIHJlYWR5LnB1c2ggcmVzXG5cbiAgIyBvcHRpb25hbCBndWxwIC8gdGFza3NcbiAgaWYgZ3VscD9cbiAgICB0YXNrIGd1bHAsIFwic291cmNlZ2F0ZVwiLCBcIldyaXRlIHNvdXJjZWdhdGUgdGFyZ2V0cy5cIiwgLT5cbiAgICAgIGZvciBzZyBpbiByZWFkeVxuICAgICAgICBzb3VyY2VnYXRlLmFwcGx5KG51bGwsIHNnKVxuICAgIGlmIG8uc291cmNlb3B0LndhdGNoXG4gICAgICB0YXNrIGd1bHAsIFwic291cmNlZ2F0ZTp3YXRjaFwiLFxuICAgICAgICBcIldhdGNoIHNvdXJjZWdhdGUgc291cmNlcyBmb3IgY2hhbmdlcy5cIiwgLT5cbiAgICAgICAgICBndWxwLndhdGNoIHdhdGNoLCBbXCJzb3VyY2VnYXRlXCJdXG5cbiAgcmVhZHlcbiJdfQ==