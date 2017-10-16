(function() {
  module.exports = {
    autoToggle: {
      title: "Auto Toggle",
      description: "Toggle on start.",
      type: "boolean",
      "default": true,
      order: 1
    },
    comboMode: {
      type: "object",
      order: 2,
      properties: {
        enabled: {
          title: "Combo Mode - Enabled",
          description: "When enabled effects won't appear until reach the activation threshold.",
          type: "boolean",
          "default": true,
          order: 1
        },
        activationThreshold: {
          title: "Combo Mode - Activation Threshold",
          description: "Streak threshold to activate the power mode.",
          type: "array",
          "default": [20, 50, 100, 200, 500],
          items: {
            type: "integer",
            minimum: 1,
            maximum: 1000
          }
        },
        streakTimeout: {
          title: "Combo Mode - Streak Timeout",
          description: "Timeout to reset the streak counter. In seconds.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationEvery: {
          title: "Combo Mode - Exclamation Every",
          description: "Shows an exclamation every streak count.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationTexts: {
          title: "Combo Mode - Exclamation Texts",
          description: "Exclamations to show (randomized).",
          type: "array",
          "default": ["Super!", "Radical!", "Fantastic!", "Great!", "OMG", "Whoah!", ":O", "Nice!", "Splendid!", "Wild!", "Grand!", "Impressive!", "Stupendous!", "Extreme!", "Awesome!"]
        },
        opacity: {
          title: "Combo Mode - Opacity",
          description: "Opacity of the streak counter.",
          type: "number",
          "default": 0.6,
          minimum: 0,
          maximum: 1
        }
      }
    },
    particles: {
      type: "object",
      order: 3,
      properties: {
        enabled: {
          title: "Particles - Enabled",
          description: "Turn the particles on/off.",
          type: "boolean",
          "default": true,
          order: 1
        },
        colours: {
          type: "object",
          properties: {
            type: {
              title: "Colours",
              description: "Configure colour options",
              type: "string",
              "default": "cursor",
              "enum": [
                {
                  value: 'cursor',
                  description: 'Particles will be the colour at the cursor.'
                }, {
                  value: 'random',
                  description: 'Particles will have random colours.'
                }, {
                  value: 'fixed',
                  description: 'Particles will have a fixed colour.'
                }
              ],
              order: 1
            },
            fixed: {
              title: "Fixed colour",
              description: "Colour when fixed colour is selected",
              type: "color",
              "default": "#fff"
            }
          }
        },
        totalCount: {
          type: "object",
          properties: {
            max: {
              title: "Particles - Max Total",
              description: "The maximum total number of particles on the screen.",
              type: "integer",
              "default": 500,
              minimum: 0
            }
          }
        },
        spawnCount: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Spawned",
              description: "The minimum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 5
            },
            max: {
              title: "Particles - Maximum Spawned",
              description: "The maximum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 15
            }
          }
        },
        size: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Size",
              description: "The minimum (randomized) size of the particles.",
              type: "integer",
              "default": 2,
              minimum: 0
            },
            max: {
              title: "Particles - Maximum Size",
              description: "The maximum (randomized) size of the particles.",
              type: "integer",
              "default": 4,
              minimum: 0
            }
          }
        },
        effect: {
          title: "Effect",
          description: "Defines the effect.",
          type: "string",
          "default": "",
          order: 7
        }
      }
    },
    screenShake: {
      type: "object",
      order: 4,
      properties: {
        enabled: {
          title: "Screen Shake - Enabled",
          description: "Turn the shaking on/off.",
          type: "boolean",
          "default": true
        },
        minIntensity: {
          title: "Screen Shake - Minimum Intensity",
          description: "The minimum (randomized) intensity of the shake.",
          type: "integer",
          "default": 1,
          minimum: 0,
          maximum: 100
        },
        maxIntensity: {
          title: "Screen Shake - Maximum Intensity",
          description: "The maximum (randomized) intensity of the shake.",
          type: "integer",
          "default": 3,
          minimum: 0,
          maximum: 100
        }
      }
    },
    playAudio: {
      type: "object",
      order: 5,
      properties: {
        enabled: {
          title: "Play Audio - Enabled",
          description: "Play audio clip on/off.",
          type: "boolean",
          "default": false,
          order: 1
        },
        audioclip: {
          title: "Play Audio - Audioclip",
          description: "Which audio clip played at keystroke.",
          type: "string",
          "default": '../audioclips/gun.wav',
          "enum": [
            {
              value: '../audioclips/gun.wav',
              description: 'Gun'
            }, {
              value: '../audioclips/typewriter.wav',
              description: 'Type Writer'
            }, {
              value: 'customAudioclip',
              description: 'Custom Path'
            }
          ],
          order: 3
        },
        customAudioclip: {
          title: "Play Audio - Path to Audioclip",
          description: "Path to audioclip played at keystroke.",
          type: "string",
          "default": 'rocksmash.wav',
          order: 4
        },
        volume: {
          title: "Play Audio - Volume",
          description: "Volume of the audio clip played at keystroke.",
          type: "number",
          "default": 0.42,
          minimum: 0.0,
          maximum: 1.0,
          order: 2
        }
      }
    },
    excludedFileTypes: {
      order: 6,
      type: "object",
      properties: {
        excluded: {
          title: "Prohibit activate-power-mode from enabling on these file types:",
          description: "Use comma separated, lowercase values (i.e. \"html, cpp, css\")",
          type: "array",
          "default": ["."]
        }
      }
    },
    flow: {
      title: "Flow",
      description: "Defines the flow when typping.",
      type: "string",
      "default": "",
      order: 7
    },
    plugins: {
      type: "object",
      order: 8,
      properties: {}
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbmZpZy1zY2hlbWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFVBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxhQUFQO01BQ0EsV0FBQSxFQUFhLGtCQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQURGO0lBT0EsU0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFFBQU47TUFDQSxLQUFBLEVBQU8sQ0FEUDtNQUVBLFVBQUEsRUFDRTtRQUFBLE9BQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxzQkFBUDtVQUNBLFdBQUEsRUFBYSx5RUFEYjtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsS0FBQSxFQUFPLENBSlA7U0FERjtRQU9BLG1CQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sbUNBQVA7VUFDQSxXQUFBLEVBQWEsOENBRGI7VUFFQSxJQUFBLEVBQU0sT0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLEdBQW5CLENBSFQ7VUFJQSxLQUFBLEVBQ0U7WUFBQSxJQUFBLEVBQU0sU0FBTjtZQUNBLE9BQUEsRUFBUyxDQURUO1lBRUEsT0FBQSxFQUFTLElBRlQ7V0FMRjtTQVJGO1FBaUJBLGFBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyw2QkFBUDtVQUNBLFdBQUEsRUFBYSxrREFEYjtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUhUO1VBSUEsT0FBQSxFQUFTLENBSlQ7VUFLQSxPQUFBLEVB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TlA7U0EzQkY7T0FIRjtLQXRLRjtJQTRNQSxpQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLENBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLFVBQUEsRUFDRTtRQUFBLFFBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxpRUFBUDtVQUNBLFdBQUEsRUFBYSxpRUFEYjtVQUVBLElBQUEsRUFBTSxPQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLEdBQUQsQ0FIVDtTQURGO09BSEY7S0E3TUY7SUFzTkEsSUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLE1BQVA7TUFDQSxXQUFBLEVBQWEsZ0NBRGI7TUFFQSxJQUFBLEVBQU0sUUFGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBdk5GO0lBNk5BLE9BQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxRQUFOO01BQ0EsS0FBQSxFQUFPLENBRFA7TUFFQSxVQUFBLEVBQVksRUFGWjtLQTlORjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgYXV0b1RvZ2dsZTpcbiAgICB0aXRsZTogXCJBdXRvIFRvZ2dsZVwiXG4gICAgZGVzY3JpcHRpb246IFwiVG9nZ2xlIG9uIHN0YXJ0LlwiXG4gICAgdHlwZTogXCJib29sZWFuXCJcbiAgICBkZWZhdWx0OiB0cnVlXG4gICAgb3JkZXI6IDFcblxuICBjb21ib01vZGU6XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIG9yZGVyOiAyXG4gICAgcHJvcGVydGllczpcbiAgICAgIGVuYWJsZWQ6XG4gICAgICAgIHRpdGxlOiBcIkNvbWJvIE1vZGUgLSBFbmFibGVkXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hlbiBlbmFibGVkIGVmZmVjdHMgd29uJ3QgYXBwZWFyIHVudGlsIHJlYWNoIHRoZSBhY3RpdmF0aW9uIHRocmVzaG9sZC5cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIG9yZGVyOiAxXG5cbiAgICAgIGFjdGl2YXRpb25UaHJlc2hvbGQ6XG4gICAgICAgIHRpdGxlOiBcIkNvbWJvIE1vZGUgLSBBY3RpdmF0aW9uIFRocmVzaG9sZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN0cmVhayB0aHJlc2hvbGQgdG8gYWN0aXZhdGUgdGhlIHBvd2VyIG1vZGUuXCJcbiAgICAgICAgdHlwZTogXCJhcnJheVwiXG4gICAgICAgIGRlZmF1bHQ6IFsyMCwgNTAsIDEwMCwgMjAwLCA1MDBdXG4gICAgICAgIGl0ZW1zOlxuICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgbWluaW11bTogMVxuICAgICAgICAgIG1heGltdW06IDEwMDBcblxuICAgICAgc3RyZWFrVGltZW91dDpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIFN0cmVhayBUaW1lb3V0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVGltZW91dCB0byByZXNldCB0aGUgc3RyZWFrIGNvdW50ZXIuIEluIHNlY29uZHMuXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMTBcbiAgICAgICAgbWluaW11bTogMVxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICAgICAgZXhjbGFtYXRpb25FdmVyeTpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIEV4Y2xhbWF0aW9uIEV2ZXJ5XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2hvd3MgYW4gZXhjbGFtYXRpb24gZXZlcnkgc3RyZWFrIGNvdW50LlwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICAgIG1pbmltdW06IDFcbiAgICAgICAgbWF4aW11bTogMTAwXG5cbiAgICAgIGV4Y2xhbWF0aW9uVGV4dHM6XG4gICAgICAgIHRpdGxlOiBcIkNvbWJvIE1vZGUgLSBFeGNsYW1hdGlvbiBUZXh0c1wiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkV4Y2xhbWF0aW9ucyB0byBzaG93IChyYW5kb21pemVkKS5cIlxuICAgICAgICB0eXBlOiBcImFycmF5XCJcbiAgICAgICAgZGVmYXVsdDogW1wiU3VwZXIhXCIsIFwiUmFkaWNhbCFcIiwgXCJGYW50YXN0aWMhXCIsIFwiR3JlYXQhXCIsIFwiT01HXCIsIFwiV2hvYWghXCIsIFwiOk9cIiwgXCJOaWNlIVwiLCBcIlNwbGVuZGlkIVwiLCBcIldpbGQhXCIsIFwiR3JhbmQhXCIsIFwiSW1wcmVzc2l2ZSFcIiwgXCJTdHVwZW5kb3VzIVwiLCBcIkV4dHJlbWUhXCIsIFwiQXdlc29tZSFcIl1cblxuICAgICAgb3BhY2l0eTpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIE9wYWNpdHlcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJPcGFjaXR5IG9mIHRoZSBzdHJlYWsgY291bnRlci5cIlxuICAgICAgICB0eXBlOiBcIm51bWJlclwiXG4gICAgICAgIGRlZmF1bHQ6IDAuNlxuICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIG1heGltdW06IDFcblxuICBwYXJ0aWNsZXM6XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIG9yZGVyOiAzXG4gICAgcHJvcGVydGllczpcbiAgICAgIGVuYWJsZWQ6XG4gICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIEVuYWJsZWRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUdXJuIHRoZSBwYXJ0aWNsZXMgb24vb2ZmLlwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgb3JkZXI6IDFcblxuICAgICAgY29sb3VyczpcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIlxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIHR5cGU6XG4gICAgICAgICAgICB0aXRsZTogXCJDb2xvdXJzXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbmZpZ3VyZSBjb2xvdXIgb3B0aW9uc1wiXG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgICAgICBkZWZhdWx0OiBcImN1cnNvclwiXG4gICAgICAgICAgICBlbnVtOiBbXG4gICAgICAgICAgICAgIHt2YWx1ZTogJ2N1cnNvcicsIGRlc2NyaXB0aW9uOiAnUGFydGljbGVzIHdpbGwgYmUgdGhlIGNvbG91ciBhdCB0aGUgY3Vyc29yLid9XG4gICAgICAgICAgICAgIHt2YWx1ZTogJ3JhbmRvbScsIGRlc2NyaXB0aW9uOiAnUGFydGljbGVzIHdpbGwgaGF2ZSByYW5kb20gY29sb3Vycy4nfVxuICAgICAgICAgICAgICB7dmFsdWU6ICdmaXhlZCcsIGRlc2NyaXB0aW9uOiAnUGFydGljbGVzIHdpbGwgaGF2ZSBhIGZpeGVkIGNvbG91ci4nfVxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgb3JkZXI6IDFcblxuICAgICAgICAgIGZpeGVkOlxuICAgICAgICAgICAgdGl0bGU6IFwiRml4ZWQgY29sb3VyXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbG91ciB3aGVuIGZpeGVkIGNvbG91ciBpcyBzZWxlY3RlZFwiXG4gICAgICAgICAgICB0eXBlOiBcImNvbG9yXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiI2ZmZlwiXG5cbiAgICAgIHRvdGFsQ291bnQ6XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICBtYXg6XG4gICAgICAgICAgICB0aXRsZTogXCJQYXJ0aWNsZXMgLSBNYXggVG90YWxcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gdG90YWwgbnVtYmVyIG9mIHBhcnRpY2xlcyBvbiB0aGUgc2NyZWVuLlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogNTAwXG4gICAgICAgICAgICBtaW5pbXVtOiAwXG5cbiAgICAgIHNwYXduQ291bnQ6XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICBtaW46XG4gICAgICAgICAgICB0aXRsZTogXCJQYXJ0aWNsZXMgLSBNaW5pbXVtIFNwYXduZWRcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1pbmltdW0gKHJhbmRvbWl6ZWQpIG51bWJlciBvZiBwYXJ0aWNsZXMgc3Bhd25lZCBvbiBpbnB1dC5cIlxuICAgICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDVcblxuICAgICAgICAgIG1heDpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1heGltdW0gU3Bhd25lZFwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSAocmFuZG9taXplZCkgbnVtYmVyIG9mIHBhcnRpY2xlcyBzcGF3bmVkIG9uIGlucHV0LlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogMTVcblxuICAgICAgc2l6ZTpcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIlxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIG1pbjpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1pbmltdW0gU2l6ZVwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWluaW11bSAocmFuZG9taXplZCkgc2l6ZSBvZiB0aGUgcGFydGljbGVzLlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogMlxuICAgICAgICAgICAgbWluaW11bTogMFxuXG4gICAgICAgICAgbWF4OlxuICAgICAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gTWF4aW11bSBTaXplXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIChyYW5kb21pemVkKSBzaXplIG9mIHRoZSBwYXJ0aWNsZXMuXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiA0XG4gICAgICAgICAgICBtaW5pbXVtOiAwXG5cbiAgICAgIGVmZmVjdDpcbiAgICAgICAgdGl0bGU6IFwiRWZmZWN0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRGVmaW5lcyB0aGUgZWZmZWN0LlwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgICBvcmRlcjogN1xuXG4gIHNjcmVlblNoYWtlOlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBvcmRlcjogNFxuICAgIHByb3BlcnRpZXM6XG4gICAgICBlbmFibGVkOlxuICAgICAgICB0aXRsZTogXCJTY3JlZW4gU2hha2UgLSBFbmFibGVkXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVHVybiB0aGUgc2hha2luZyBvbi9vZmYuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuXG4gICAgICBtaW5JbnRlbnNpdHk6XG4gICAgICAgIHRpdGxlOiBcIlNjcmVlbiBTaGFrZSAtIE1pbmltdW0gSW50ZW5zaXR5XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1pbmltdW0gKHJhbmRvbWl6ZWQpIGludGVuc2l0eSBvZiB0aGUgc2hha2UuXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMVxuICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIG1heGltdW06IDEwMFxuXG4gICAgICBtYXhJbnRlbnNpdHk6XG4gICAgICAgIHRpdGxlOiBcIlNjcmVlbiBTaGFrZSAtIE1heGltdW0gSW50ZW5zaXR5XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gKHJhbmRvbWl6ZWQpIGludGVuc2l0eSBvZiB0aGUgc2hha2UuXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogM1xuICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIG1heGltdW06IDEwMFxuXG4gIHBsYXlBdWRpbzpcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgb3JkZXI6IDVcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZW5hYmxlZDpcbiAgICAgICAgdGl0bGU6IFwiUGxheSBBdWRpbyAtIEVuYWJsZWRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJQbGF5IGF1ZGlvIGNsaXAgb24vb2ZmLlwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIG9yZGVyOiAxXG5cbiAgICAgIGF1ZGlvY2xpcDpcbiAgICAgICAgdGl0bGU6IFwiUGxheSBBdWRpbyAtIEF1ZGlvY2xpcFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIldoaWNoIGF1ZGlvIGNsaXAgcGxheWVkIGF0IGtleXN0cm9rZS5cIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6ICcuLi9hdWRpb2NsaXBzL2d1bi53YXYnXG4gICAgICAgIGVudW06IFtcbiAgICAgICAgICB7dmFsdWU6ICcuLi9hdWRpb2NsaXBzL2d1bi53YXYnLCBkZXNjcmlwdGlvbjogJ0d1bid9XG4gICAgICAgICAge3ZhbHVlOiAnLi4vYXVkaW9jbGlwcy90eXBld3JpdGVyLndhdicsIGRlc2NyaXB0aW9uOiAnVHlwZSBXcml0ZXInfVxuICAgICAgICAgIHt2YWx1ZTogJ2N1c3RvbUF1ZGlvY2xpcCcsIGRlc2NyaXB0aW9uOiAnQ3VzdG9tIFBhdGgnfVxuICAgICAgICBdXG4gICAgICAgIG9yZGVyOiAzXG5cbiAgICAgIGN1c3RvbUF1ZGlvY2xpcDpcbiAgICAgICAgdGl0bGU6IFwiUGxheSBBdWRpbyAtIFBhdGggdG8gQXVkaW9jbGlwXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBhdWRpb2NsaXAgcGxheWVkIGF0IGtleXN0cm9rZS5cIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6ICdyb2Nrc21hc2gud2F2J1xuICAgICAgICBvcmRlcjogNFxuXG4gICAgICB2b2x1bWU6XG4gICAgICAgIHRpdGxlOiBcIlBsYXkgQXVkaW8gLSBWb2x1bWVcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJWb2x1bWUgb2YgdGhlIGF1ZGlvIGNsaXAgcGxheWVkIGF0IGtleXN0cm9rZS5cIlxuICAgICAgICB0eXBlOiBcIm51bWJlclwiXG4gICAgICAgIGRlZmF1bHQ6IDAuNDJcbiAgICAgICAgbWluaW11bTogMC4wXG4gICAgICAgIG1heGltdW06IDEuMFxuICAgICAgICBvcmRlcjogMlxuXG4gIGV4Y2x1ZGVkRmlsZVR5cGVzOlxuICAgIG9yZGVyOiA2XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBleGNsdWRlZDpcbiAgICAgICAgdGl0bGU6IFwiUHJvaGliaXQgYWN0aXZhdGUtcG93ZXItbW9kZSBmcm9tIGVuYWJsaW5nIG9uIHRoZXNlIGZpbGUgdHlwZXM6XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVXNlIGNvbW1hIHNlcGFyYXRlZCwgbG93ZXJjYXNlIHZhbHVlcyAoaS5lLiBcXFwiaHRtbCwgY3BwLCBjc3NcXFwiKVwiXG4gICAgICAgIHR5cGU6IFwiYXJyYXlcIlxuICAgICAgICBkZWZhdWx0OiBbXCIuXCJdXG5cbiAgZmxvdzpcbiAgICB0aXRsZTogXCJGbG93XCJcbiAgICBkZXNjcmlwdGlvbjogXCJEZWZpbmVzIHRoZSBmbG93IHdoZW4gdHlwcGluZy5cIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBcIlwiXG4gICAgb3JkZXI6IDdcblxuICBwbHVnaW5zOlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBvcmRlcjogOFxuICAgIHByb3BlcnRpZXM6IHt9XG4iXX0=
