//
//  RpViewController.swift
//  RandoplanShare
//
//  Created by BRIAN FEINBERG on 2/5/24.
//  Copyright © 2024 Randoplan.com. All rights reserved.
//

import Foundation
import UIKit
import SwiftUI
import Social
//import SafariServices
import UniformTypeIdentifiers

class RpViewController: UIViewController {
    
    enum routeType : Equatable {
        case rwgps
        case strava
    }
    
    private func makeRandoplanUrl(routeId: String, type: routeType) -> URL {
        return URL(string:"https://www.randoplan.com?" + ((type==routeType.rwgps) ? "rwgpsRoute=":"strava_route=") + routeId + "&stopAfterLoad=true")!
    }
    
    @objc func openURL(_ url: URL) -> Bool {
        var responder: UIResponder? = self
        while responder != nil {
            if let application = responder as? UIApplication {
                application.open(url) { success in
                    if success {
                        print("browser successfuly opened")
                    }
                }
                return true
            }
            responder = responder?.next
        }
        return false
    }
    
    private let typeText = UTType.text.identifier
    private let typeURL = UTType.url.identifier
    
    private func handleIncomingText(itemProvider: NSItemProvider) {
        itemProvider.loadItem(forTypeIdentifier: typeText as String, options: nil) { (item, error) in
            if let error = error {
                self.extensionContext?.cancelRequest(withError: error)
            }
            
            if let text = item as? String {
                do {
                    // Detect URLs in String
                    let detector = try NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
                    let matches = detector.matches(
                        in: text,
                        options: [],
                        range: NSRange(location: 0, length: text.utf16.count)
                    )
                    // Get first URL found
                    if let firstMatch = matches.first, let range = Range(firstMatch.range, in: text) {
                        let contentText = String(text[range])
                        let routeId = URL(string: contentText)?.lastPathComponent
                        let randoplanUrl = self.makeRandoplanUrl(routeId:routeId!,type:routeType.rwgps)
                        print("Opened RWGPS URL with result " + String(self.openURL(randoplanUrl)))
//                        let config = SFSafariViewController.Configuration()
//                        let vc = SFSafariViewController(url: randoplanUrl, configuration: config)
//                        self.present(vc, animated: true, completion: {() in print("done with sfsafari")})
}
                } catch let error {
                    self.extensionContext?.cancelRequest(withError: error)
                }
            }
            
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
    
    private func handleIncomingURL(itemProvider: NSItemProvider) {
        itemProvider.loadItem(forTypeIdentifier: typeURL, options: nil) { (item, error) in
            if let error = error {
                self.extensionContext?.cancelRequest(withError: error)
            }
            
            if let url = item as? NSURL, let urlString = url.absoluteString {
                let routeId = URL(string: urlString)?.lastPathComponent
                if (urlString.contains("ridewithgps")) {
                    let randoplanUrl = self.makeRandoplanUrl(routeId: routeId!, type:routeType.rwgps)
                    print("Opened RWGPS URL with result " + String(self.openURL(randoplanUrl)))
                } else {
                    let randoplanUrl = self.makeRandoplanUrl(routeId: routeId!, type:routeType.strava)
                    print("Opened Strava URL with result " + String(self.openURL(randoplanUrl)))
                }
            }
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        guard let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem,
              let itemProvider = extensionItem.attachments?.first else {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
            return
        }
        
        if itemProvider.hasItemConformingToTypeIdentifier(typeText) {
            handleIncomingText(itemProvider: itemProvider)
            // Check if object is of type URL
        }
        if itemProvider.hasItemConformingToTypeIdentifier(typeURL) {
            handleIncomingURL(itemProvider: itemProvider)
        } else {
            print("Error: No url or text found")
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
}
