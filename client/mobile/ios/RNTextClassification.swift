//
//  TextClassification.swift
//  yesboss
//
//  Created by imac on 19/08/2021.
//

// Copyright 2019 The TensorFlow Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import Foundation


import UIKit




class RNTextClassification : NSObject{
  
  private  var classifier: TFLNLClassifier?
  private  var results: [ClassificationResult] = []


  
  override init() {
    super.init()
    print("Text classification init ...")
  }

  @objc static func requiresMainQueueSetup()-> Bool {
    return false
  }
  
  @objc func sayHello()->Void {
    print("hello from swift")
    
  }
  
  
  /// Classify the text and display the result.
   @objc func classifyWithData(_ text: String) ->String? {
    self.loadModelWithData()

          print("Classify begins "+text)
          guard let classifier = self.classifier else {
            print("returning .... ")
            return nil
            
          }

          print("after getting classifier instance")
          
          let classifierResults = classifier.classify(text: text)
          let result = ClassificationResult(text: text, results: classifierResults)
          self.results.append(result)
          print(self.results)
          var strResult = "["

          for i in 0..<self.results.count {
            for j in 0..<self.results[i].results.count{
              strResult += "{"
              strResult += "\"title\":"+String(j)//self.results[i].text
              strResult += ",\"id\":"+String(j)
              let confidence = self.results[i].results[String(j)] != nil ?self.results[i].results[String(j)] : 0

              strResult += ",\"confidence\":"+String(confidence as! Double)
              strResult += (j == self.results[i].results.count-1 ? "}" : "},")
              

            }
              
          }
          
          strResult += "]"
      
    var resultText = text
    resultText.removeLast()
    print("resultText",resultText)
    resultText += ",\"result\":"+strResult + "}"
    print("resultText",resultText)


    return resultText
  }
  
  
  
  @objc func loadModelWithData(_ modelpath : String) {
    guard let modelPath = Bundle.main.path(
      forResource: modelpath, ofType: "tflite") else { return }
    let options = TFLNLClassifierOptions()
    self.classifier = TFLNLClassifier.nlClassifier(modelPath: modelPath, options: options)
    print("model loaded ...")
    print(self.classifier)
    
  }
  
  @objc func loadModelWithData() {
    self.loadModelWithData("liteModel6")
  }


  struct ClassificationResult {

  var text: String
  var results: [String: NSNumber]

}
}
